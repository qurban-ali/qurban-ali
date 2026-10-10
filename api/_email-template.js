// HTML emails sent by the contact form:
//   buildLeadEmail      -> the notification you receive for each new lead
//   buildAutoReplyEmail -> the confirmation the visitor receives
// Files in /api starting with "_" are not exposed as routes by Vercel.
// Built with tables + inline styles so they render in Gmail, Outlook and Apple Mail.

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

const SITE_URL = 'https://qurbanali.me';
const LINKEDIN_URL = 'https://www.linkedin.com/in/qurbanali-pro/';
const CALENDAR_URL = 'https://calendar.app.google/znTqcTXv8akh1YGy7';

const firstNameOf = (name) => escapeHtml(name.split(/\s+/)[0]);

const detailRow = (label, valueHtml) => `
    <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid ${COLORS.border}; width: 120px; vertical-align: top;
                   font-family: ${FONT}; font-size: 12px; font-weight: 600; letter-spacing: 0.6px;
                   text-transform: uppercase; color: ${COLORS.muted};">${label}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid ${COLORS.border}; vertical-align: top;
                   font-family: ${FONT}; font-size: 15px; color: ${COLORS.text};">${valueHtml}</td>
    </tr>`;

const sectionLabel = (text) => `
    <div style="font-family: ${FONT}; font-size: 12px; font-weight: 600; letter-spacing: 0.6px;
                text-transform: uppercase; color: ${COLORS.muted}; margin-bottom: 8px;">${text}</div>`;

const messageBox = (message) => `
    <div style="background: ${COLORS.soft}; border-left: 4px solid ${COLORS.teal}; border-radius: 8px;
                padding: 16px 18px; font-family: ${FONT}; font-size: 15px; line-height: 1.65;
                color: ${COLORS.text}; white-space: pre-wrap;">${escapeHtml(message)}</div>`;

const button = (href, label) => `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td bgcolor="${COLORS.indigo}" style="border-radius: 10px; background: ${COLORS.indigo};">
                <a href="${href}"
                   style="display: inline-block; padding: 14px 32px; font-family: ${FONT}; font-size: 15px;
                          font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 10px;">
                    ${label}
                </a>
            </td>
        </tr>
    </table>`;

const serviceBadge = (service, isOther) => `
    <span style="display: inline-block; padding: 4px 12px; border-radius: 999px; background: #e0f7f4;
                 color: #0f766e; font-size: 13px; font-weight: 600;">${escapeHtml(service)}</span>
    ${isOther ? `<span style="font-size: 12px; color: ${COLORS.muted};">&nbsp;(custom request)</span>` : ''}`;

// Shared branded frame: dark header with logo, accent bar, white card, footer.
function layout({ title, preheader, eyebrow, headline, content, footer }) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background: ${COLORS.page};">
<div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${COLORS.page}"
       style="background: ${COLORS.page};">
    <tr>
        <td align="center" style="padding: 32px 16px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                   style="max-width: 600px; background: ${COLORS.card}; border-radius: 16px; overflow: hidden;
                          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);">
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
                            ${eyebrow}
                        </div>
                        <div style="margin-top: 6px; font-family: ${FONT}; font-size: 24px; font-weight: 700;
                                    line-height: 1.3; color: #ffffff;">
                            ${headline}
                        </div>
                    </td>
                </tr>
                <tr>
                    <td height="4" bgcolor="${COLORS.indigo}"
                        style="height: 4px; line-height: 4px; font-size: 0;
                               background-image: linear-gradient(90deg, ${COLORS.indigo}, ${COLORS.teal});">&nbsp;</td>
                </tr>
                ${content}
                <tr>
                    <td style="padding: 18px 32px; border-top: 1px solid ${COLORS.border}; background: ${COLORS.soft};
                               font-family: ${FONT}; font-size: 12px; line-height: 1.6; color: ${COLORS.muted};"
                        align="center">
                        ${footer}
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>`;
}

function buildLeadEmail({ name, email, service, isOther, message, subscribed, submittedAt }) {
    const n = escapeHtml(name);
    const e = escapeHtml(email);
    const s = escapeHtml(service);
    const firstName = firstNameOf(name);
    const when = new Date(submittedAt).toLocaleString('en-GB', {
        timeZone: 'Asia/Karachi',
        dateStyle: 'medium',
        timeStyle: 'short'
    });
    const broadcastBadge = subscribed
        ? `<span style="color: #0f766e; font-weight: 600;">&#10003; Opted in to updates</span>`
        : `<span style="color: ${COLORS.muted};">Not subscribed</span>`;

    return layout({
        title: `New lead: ${s}`,
        preheader: `${n} is interested in ${s}. ${escapeHtml(message.slice(0, 90))}`,
        eyebrow: 'New lead from your portfolio',
        headline: `${firstName} wants to talk about ${s}`,
        content: `
            <tr>
                <td style="padding: 24px 32px 8px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        ${detailRow('Name', n)}
                        ${detailRow('Email', `<a href="mailto:${e}" style="color: ${COLORS.indigo}; text-decoration: none;">${e}</a>`)}
                        ${detailRow('Service', serviceBadge(service, isOther))}
                        ${detailRow('Broadcasts', broadcastBadge)}
                        ${detailRow('Received', `${escapeHtml(when)} <span style="color: ${COLORS.muted};">(PKT)</span>`)}
                    </table>
                </td>
            </tr>
            <tr>
                <td style="padding: 16px 32px 8px;">
                    ${sectionLabel('Message')}
                    ${messageBox(message)}
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 24px 32px 32px;">
                    ${button(`mailto:${e}?subject=${encodeURIComponent(`Re: ${service}`)}`, `Reply to ${firstName} &rarr;`)}
                    <div style="margin-top: 12px; font-family: ${FONT}; font-size: 12px; color: ${COLORS.muted};">
                        Or just hit reply &mdash; it goes straight to ${e}
                    </div>
                </td>
            </tr>`,
        footer: `Sent from the contact form on
            <a href="${SITE_URL}" style="color: ${COLORS.indigo}; text-decoration: none;">qurbanali.me</a>
            &middot; Saved to your Resend contacts`
    });
}

function buildAutoReplyEmail({ name, service, message }) {
    const firstName = firstNameOf(name);
    const s = escapeHtml(service);
    const p = (html) => `
        <p style="margin: 0 0 16px; font-family: ${FONT}; font-size: 15px; line-height: 1.7; color: ${COLORS.text};">
            ${html}
        </p>`;

    return layout({
        title: 'Thank you for getting in touch',
        preheader: `Thanks ${firstName}, I've received your message about ${s} and will reply within 1–2 business days.`,
        eyebrow: 'Message received',
        headline: `Thank you for reaching out, ${firstName}`,
        content: `
            <tr>
                <td style="padding: 28px 32px 8px;">
                    ${p(`Hi ${firstName},`)}
                    ${p(`Thank you for contacting me. I've received your enquiry about <strong>${s}</strong> and will
                         review it personally. You can expect a reply within <strong>1–2 business days</strong>.`)}
                    ${p(`If your request is time-sensitive, feel free to book a short call at a time that suits you.`)}
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 4px 32px 24px;">
                    ${button(CALENDAR_URL, 'Schedule a 1-on-1 call &rarr;')}
                </td>
            </tr>
            <tr>
                <td style="padding: 0 32px 8px;">
                    ${sectionLabel('Your request')}
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        ${detailRow('Service', serviceBadge(service, false))}
                    </table>
                    <div style="height: 16px; line-height: 16px; font-size: 0;">&nbsp;</div>
                    ${sectionLabel('Your message')}
                    ${messageBox(message)}
                </td>
            </tr>
            <tr>
                <td style="padding: 24px 32px 32px;">
                    ${p('Best regards,')}
                    <div style="font-family: ${FONT}; font-size: 16px; font-weight: 700; color: ${COLORS.text};">
                        Qurban Ali
                    </div>
                    <div style="font-family: ${FONT}; font-size: 13px; line-height: 1.6; color: ${COLORS.muted};">
                        Engineering Team Lead &amp; Senior Full-Stack Developer<br>
                        <a href="${SITE_URL}" style="color: ${COLORS.indigo}; text-decoration: none;">qurbanali.me</a>
                        &nbsp;&middot;&nbsp;
                        <a href="${LINKEDIN_URL}" style="color: ${COLORS.indigo}; text-decoration: none;">LinkedIn</a>
                    </div>
                </td>
            </tr>`,
        footer: `You're receiving this email because you submitted the contact form on
            <a href="${SITE_URL}" style="color: ${COLORS.indigo}; text-decoration: none;">qurbanali.me</a>.
            If this wasn't you, you can safely ignore it.`
    });
}

module.exports = { buildLeadEmail, buildAutoReplyEmail, escapeHtml };
