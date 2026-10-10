// Vercel serverless function: sends contact form submissions to your inbox via Resend.
// Required env var:  RESEND_API_KEY
// Optional env vars: CONTACT_TO_EMAIL   (default: qurbanali.pro@gmail.com)
//                    CONTACT_FROM_EMAIL (default: Qurban Ali Portfolio <noreply@qurbanali.me>)

const escapeHtml = (str) =>
    String(str).replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

const fail = (res, status, message) =>
    res.status(status).json({ errors: [{ message }] });

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
    // "Other" means the visitor typed their own service; older clients may still send `subject`
    const subject = (service === 'Other' ? otherService : service) || String(body.subject || '').trim().slice(0, 200);
    const message = String(body.message || '').trim().slice(0, 5000);

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
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from,
                to: [to],
                reply_to: email,
                subject: `[Portfolio] ${subject}`,
                text: `New message from your portfolio contact form\n\nName: ${name}\nEmail: ${email}\nService: ${subject}\n\n${message}`,
                html: `
                    <h2>New message from your portfolio contact form</h2>
                    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
                    <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
                    <p><strong>Service:</strong> ${escapeHtml(subject)}</p>
                    <hr>
                    <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
                `
            })
        });

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
