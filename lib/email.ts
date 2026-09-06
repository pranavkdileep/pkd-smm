import {createHash} from 'node:crypto';
import {Resend} from 'resend';

/** Payload shared by every transactional email the app sends. */
export interface EmailMessage {
  to: string;
  subject: string;
  body: string;
}

/**
 * Default sender uses Resend's sandbox domain, which only delivers to the
 * account owner's inbox. Once a custom domain is verified in Resend, set
 * EMAIL_FROM (e.g. `PKD-SMM Panel <noreply@yourdomain.com>`) in `.env.local`.
 */
const DEFAULT_FROM = 'PKD-SMM Panel <onboarding@resend.dev>';

let resendClient: Resend | null = null;

/** Lazily build the client so importing this module never requires the key. */
function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not set. Add it to .env.local');
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

/** Turns a plain-text body into simple HTML with clickable links. */
function plainTextToHtml(body: string): string {
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((block) =>
      escapeHtml(block.trim())
        .replace(/https?:\/\/[^\s]+/g, (url) => `<a href="${url}">${url}</a>`)
        .replaceAll('\n', '<br />'),
    )
    .filter((block) => block.length > 0);
  return paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join('');
}

/**
 * Sends a transactional email through Resend.
 *
 * Throws on API errors so the calling workflow step is retried
 * automatically. A deterministic idempotency key (hash of the message
 * content) keeps retries from producing duplicate sends.
 */
export async function sendEmail(message: EmailMessage): Promise<void> {
  const resend = getResendClient();
  const from = process.env.EMAIL_FROM ?? DEFAULT_FROM;

  const idempotencyKey = createHash('sha256')
    .update(`${message.to}\n${message.subject}\n${message.body}`)
    .digest('hex');

  const {data, error} = await resend.emails.send(
    {
      from,
      to: message.to,
      subject: message.subject,
      text: message.body,
      html: plainTextToHtml(message.body),
    },
    {idempotencyKey},
  );

  if (error) {
    throw new Error(
      `Resend failed to send email to ${message.to} (${error.name}, status ${error.statusCode ?? 'unknown'}): ${error.message}`,
    );
  }

  console.log(`[email] sent id=${data.id} to=${message.to} subject="${message.subject}"`);
}
