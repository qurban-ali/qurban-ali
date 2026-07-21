export default async function handler(req, res) {
    // Enable CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    try {
        // Parse request body
        let body = req.body;
        if (typeof body === 'string') {
            try {
                body = JSON.parse(body);
            } catch (e) {
                // Keep as is if parsing fails
            }
        }

        const { name, email, subject, message } = body || {};

        // Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'Please provide all required fields: name, email, subject, and message.' });
        }

        const apiKey = process.env.RESEND_API_KEY;

        if (!apiKey) {
            console.error('RESEND_API_KEY environment variable is not configured.');
            return res.status(500).json({
                error: 'Server email configuration missing. Please add RESEND_API_KEY in Vercel project settings.'
            });
        }

        const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Portfolio Contact <onboarding@resend.dev>',
                to: ['qurbanali.pro@gmail.com'],
                reply_to: email,
                subject: `[Portfolio] ${subject}`,
                html: `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #0d131f; color: #f1f5f9; border-radius: 12px; border: 1px solid #1e293b;">
                        <h2 style="color: #14b8a6; margin-top: 0; font-size: 20px; border-bottom: 1px solid #1e293b; padding-bottom: 12px;">📬 New Portfolio Inquiry</h2>
                        
                        <div style="margin-bottom: 16px;">
                            <p style="margin: 4px 0; color: #94a3b8; font-size: 14px;"><strong>From:</strong> <span style="color: #f1f5f9;">${escapeHtml(name)}</span></p>
                            <p style="margin: 4px 0; color: #94a3b8; font-size: 14px;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}" style="color: #38bdf8; text-decoration: none;">${escapeHtml(email)}</a></p>
                            <p style="margin: 4px 0; color: #94a3b8; font-size: 14px;"><strong>Subject:</strong> <span style="color: #f1f5f9;">${escapeHtml(subject)}</span></p>
                        </div>
                        
                        <div style="background-color: #161f30; padding: 16px; border-radius: 8px; border-left: 4px solid #14b8a6; margin-top: 20px;">
                            <p style="margin: 0; color: #e2e8f0; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</p>
                        </div>
                        
                        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #1e293b; text-align: center; color: #64748b; font-size: 12px;">
                            <p style="margin: 0;">Received via portfolio contact form at qurbanali-pro.vercel.app</p>
                        </div>
                    </div>
                `
            })
        });

        const data = await resendResponse.json();

        if (resendResponse.ok) {
            return res.status(200).json({ success: true, id: data.id });
        } else {
            console.error('Resend API Response Error:', data);
            return res.status(resendResponse.status || 500).json({
                error: data.message || 'Failed to deliver email through Resend.'
            });
        }
    } catch (err) {
        console.error('Error in send-email serverless function:', err);
        return res.status(500).json({ error: 'Internal server error while processing email delivery.' });
    }
}

function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
