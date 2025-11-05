import formData from "form-data";
import Mailgun from "mailgun.js";

type SendArgs = {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
};

type SendResult = {
  provider: "mailgun";
  messageId?: string;
  error?: string;
};

export async function sendEmail({ to, subject, html, from }: SendArgs): Promise<SendResult> {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  const sender = from || process.env.MAIL_FROM || process.env.MAILGUN_FROM; // support both
  const baseUrl = process.env.MAILGUN_API_URL; // optional (EU/US)

  if (!apiKey || !domain || !sender) {
    const msg = "Mailgun not configured (need MAILGUN_API_KEY, MAILGUN_DOMAIN, and MAIL_FROM or MAILGUN_FROM)";
    console.error(msg, { hasApiKey: !!apiKey, hasDomain: !!domain, hasSender: !!sender });
    return { provider: "mailgun", error: msg };
  }

  try {
    const mg = new Mailgun(formData);
    const client = mg.client({ username: "api", key: apiKey, ...(baseUrl ? { url: baseUrl } : {}) });

    const res = await client.messages.create(domain, {
      from: sender,
      to,
      subject,
      html,
      "o:testmode": "no", // ensure not in test mode
    });

    console.log("✅ Mailgun queued:", res.id);
    return { provider: "mailgun", messageId: res.id };
  } catch (err: any) {
    const detail =
      err?.response?.body?.message ||
      err?.response?.body?.detail ||
      err?.message ||
      "Send failed";
    console.error("❌ Mailgun send error:", { status: err?.status, detail, body: err?.response?.body });
    return { provider: "mailgun", error: detail };
  }
}
