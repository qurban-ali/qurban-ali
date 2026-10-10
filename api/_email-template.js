// HTML email sent to you for each new contact-form lead.
// Files in /api starting with "_" are not exposed as routes by Vercel.
// Built with tables + inline styles so it renders in Gmail, Outlook and Apple Mail.

const escapeHtml = (str) =>
    String(str).replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

const COLORS = {
    page: '#eef1f6',
    card: '#ffffff',
    header: '#0b1120',
    indigo: '#6366f1',
    teal: '#14b8a6',
    text: '#111827',
    muted: '#6b7280',
    border: '#e5e7eb',
    soft: '#f6f7fb'
};

const FONT = "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif";

const detailRow = (label, valueHtml) => `
    <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid ${COLORS.border}; width: 120px; vertical-align: top;
                   font-family: ${FONT}; font-size: 12px; font-weight: 600; letter-spacing: 0.6px;
                   text-transform: uppercase; color: ${COLORS.muted};">${label}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid ${COLORS.border}; vertical-align: top;
                   font-family: ${FONT}; font-size: 15px; color: ${COLORS.text};">${valueHtml}</td>
    </tr>`;

function buildLeadEmail({ name, email, service, isOther, message, subscribed, submittedAt }) {
    const n = escapeHtml(name);
    const e = escapeHtml(email);
    const s = escapeHtml(service);
    const firstName = escapeHtml(name.split(/\s+/)[0]);
    const replySubject = encodeURIComponent(`Re: ${service}`);
    const when = new Date(submittedAt).toLocaleString('en-GB', {
        timeZone: 'Asia/Karachi',
        dateStyle: 'medium',
        timeStyle: 'short'
    });

    const serviceBadge = `
        <span style="display: inline-block; padding: 4px 12px; border-radius: 999px; background: #e0f7f4;
                     color: #0f766e; font-size: 13px; font-weight: 600;">${s}</span>
        ${isOther ? `<span style="font-size: 12px; color: ${COLORS.muted};">&nbsp;(custom request)</span>` : ''}`;

    const broadcastBadge = subscribed
        ? `<span style="color: #0f766e; font-weight: 600;">&#10003; Opted in to updates</span>`
        : `<span style="color: ${COLORS.muted};">Not subscribed</span>`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>New lead: ${s}</title>
</head>
<body style="margin: 0; padding: 0; background: ${COLORS.page};">
<div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">
    ${n} is interested in ${s}. ${escapeHtml(message.slice(0, 90))}
</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${COLORS.page}"
       style="background: ${COLORS.page};">
    <tr>
        <td align="center" style="padding: 32px 16px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                   style="max-width: 600px; background: ${COLORS.card}; border-radius: 16px; overflow: hidden;
                          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);">

                <!-- Header -->
                <tr>
                    <td bgcolor="${COLORS.header}"
                        style="background: ${COLORS.header};
                               background-image: linear-gradient(135deg, #0b1120 0%, #1e1b4b 55%, #134e4a 100%);
                               padding: 28px 32px;">
                        <div style="font-family: 'Courier New', monospace; font-size: 18px; font-weight: 700;
                                    color: #ffffff;">
                            <span style="color: ${COLORS.teal};">&lt;</span>Qurban.Ali<span
                                style="color: ${COLORS.teal};">/&gt;</span>
                        </div>
                        <div style="margin-top: 18px; font-family: ${FONT}; font-size: 12px; font-weight: 600;
                                    letter-spacing: 1.5px; text-transform: uppercase; color: ${COLORS.teal};">
                            New lead from your portfolio
                        </div>
                        <div style="margin-top: 6px; font-family: ${FONT}; font-size: 24px; font-weight: 700;
                                    line-height: 1.3; color: #ffffff;">
                            ${firstName} wants to talk about ${s}
                        </div>
                    </td>
                </tr>

                <!-- Accent bar -->
                <tr>
                    <td height="4" bgcolor="${COLORS.indigo}"
                        style="height: 4px; line-height: 4px; font-size: 0;
                               background-image: linear-gradient(90deg, ${COLORS.indigo}, ${COLORS.teal});">&nbsp;</td>
                </tr>

                <!-- Details -->
                <tr>
                    <td style="padding: 24px 32px 8px;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            ${detailRow('Name', n)}
                            ${detailRow('Email', `<a href="mailto:${e}" style="color: ${COLORS.indigo}; text-decoration: none;">${e}</a>`)}
                            ${detailRow('Service', serviceBadge)}
                            ${detailRow('Broadcasts', broadcastBadge)}
                            ${detailRow('Received', `${escapeHtml(when)} <span style="color: ${COLORS.muted};">(PKT)</span>`)}
                        </table>
                    </td>
                </tr>

                <!-- Message -->
                <tr>
                    <td style="padding: 16px 32px 8px;">
                        <div style="font-family: ${FONT}; font-size: 12px; font-weight: 600; letter-spacing: 0.6px;
                                    text-transform: uppercase; color: ${COLORS.muted}; margin-bottom: 8px;">
                            Message
                        </div>
                        <div style="background: ${COLORS.soft}; border-left: 4px solid ${COLORS.teal};
                                    border-radius: 8px; padding: 16px 18px; font-family: ${FONT}; font-size: 15px;
                                    line-height: 1.65; color: ${COLORS.text}; white-space: pre-wrap;">${escapeHtml(message)}</div>
                    </td>
                </tr>

                <!-- Reply button -->
                <tr>
                    <td align="center" style="padding: 24px 32px 32px;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td bgcolor="${COLORS.indigo}" style="border-radius: 10px; background: ${COLORS.indigo};">
                                    <a href="mailto:${e}?subject=${replySubject}"
                                       style="display: inline-block; padding: 14px 32px; font-family: ${FONT};
                                              font-size: 15px; font-weight: 600; color: #ffffff;
                                              text-decoration: none; border-radius: 10px;">
                                        Reply to ${firstName} &rarr;
                                    </a>
                                </td>
                            </tr>
                        </table>
                        <div style="margin-top: 12px; font-family: ${FONT}; font-size: 12px; color: ${COLORS.muted};">
                            Or just hit reply &mdash; it goes straight to ${e}
                        </div>
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td style="padding: 18px 32px; border-top: 1px solid ${COLORS.border}; background: ${COLORS.soft};
                               font-family: ${FONT}; font-size: 12px; line-height: 1.6; color: ${COLORS.muted};"
                        align="center">
                        Sent from the contact form on
                        <a href="https://qurbanali.me" style="color: ${COLORS.indigo}; text-decoration: none;">qurbanali.me</a>
                        &middot; Saved to your Resend contacts
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>`;
}

module.exports = { buildLeadEmail, escapeHtml };
