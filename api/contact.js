// Vercel serverless function: emails contact form leads to you via Resend and
// saves each lead as a Resend contact so you can send Broadcasts later.
// Required env var:  RESEND_API_KEY (must be a "Full access" key to save contacts)
// Optional env vars: CONTACT_TO_EMAIL   (default: qurbanali.pro@gmail.com)
//                    CONTACT_FROM_EMAIL (default: Qurban Ali Portfolio <noreply@qurbanali.me>)
//                    RESEND_SEGMENT_ID  (adds every lead to this Resend segment)

const { buildLeadEmail } = require('./_email-template');

const RESEND_API = 'https://api.resend.com';

const fail = (res, status, message) =>
    res.status(status).json({ errors: [{ message }] });

const resendRequest = (apiKey, path, payload) =>
    fetch(`${RESEND_API}${path}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

// Save the lead as a contact. Visitors who didn't tick the opt-in box are stored
// as unsubscribed, so they are kept as leads but never receive Broadcasts.
async function saveContact(apiKey, { name, email, subscribed }) {
    const [firstName, ...rest] = name.split(/\s+/);
    const payload = {
        email,
        first_name: firstName,
        last_name: rest.join(' ') || undefined,
        unsubscribed: !subscribed
    };
    if (process.env.RESEND_SEGMENT_ID) {
        payload.segments = [{ id: process.env.RESEND_SEGMENT_ID }];
    }

    try {
        const response = await resendRequest(apiKey, '/contacts', payload);
        if (!response.ok) {
            // e.g. the contact already exists, or the API key is "Sending access" only
            console.warn('Resend contact not saved:', response.status, await response.text());
        }
    } catch (err) {
        console.warn('Resend contact not saved:', err);
    }
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return fail(res, 405, 'Method not allowed.');
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.error('RESEND_API_KEY is not set');
        return fail(res, 500, 'Email service is not configured. Please try again later.');
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const name = String(body.name || '').trim().slice(0, 200);
    const email = String(body.email || '').trim().slice(0, 200);
    const service = String(body.service || '').trim().slice(0, 200);
    const otherService = String(body.other_service || '').trim().slice(0, 200);
    const isOther = service === 'Other';
    // "Other" means the visitor typed their own service; older clients may still send `subject`
    const subject = (isOther ? otherService : service) || String(body.subject || '').trim().slice(0, 200);
    const message = String(body.message || '').trim().slice(0, 5000);
    const subscribed = body.subscribe === 'yes' || body.subscribe === true;

    // Honeypot: real visitors never fill this hidden field, bots usually do.
    if (body.website) {
        return res.status(200).json({ ok: true });
    }

    if (!name || !email || !subject || !message) {
        return fail(res, 400, 'Please fill in all fields, including the service.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return fail(res, 400, 'Please enter a valid email address.');
    }

    const to = process.env.CONTACT_TO_EMAIL || 'qurbanali.pro@gmail.com';
    const from = process.env.CONTACT_FROM_EMAIL || 'Qurban Ali Portfolio <noreply@qurbanali.me>';

    try {
        const [response] = await Promise.all([
            resendRequest(apiKey, '/emails', {
                from,
                to: [to],
                reply_to: email,
                subject: `New lead: ${subject} — ${name}`,
                text: [
                    'New lead from your portfolio contact form',
                    '',
                    `Name: ${name}`,
                    `Email: ${email}`,
                    `Service: ${subject}${isOther ? ' (custom request)' : ''}`,
                    `Broadcasts: ${subscribed ? 'opted in' : 'not subscribed'}`,
                    '',
                    message
                ].join('\n'),
                html: buildLeadEmail({
                    name, email, service: subject, isOther, message, subscribed,
                    submittedAt: Date.now()
                })
            }),
            saveContact(apiKey, { name, email, subscribed })
        ]);

        if (!response.ok) {
            const detail = await response.text();
            console.error('Resend error:', response.status, detail);
            return fail(res, 502, 'Could not send your message. Please try again later.');
        }

        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error('Contact form error:', err);
        return fail(res, 500, 'Could not send your message. Please try again later.');
    }
};
