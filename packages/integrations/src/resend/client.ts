/**
 * Resend Email Client
 *
 * Server-side email sending via Resend API.
 * Note: This should only be used in API routes/server functions.
 */

import { Resend } from 'resend';
import { getEnvVar } from '../env.js';
import type { EmailOptions, EmailResponse, BatchEmailOptions, BatchEmailResponse } from './types.js';

let resendInstance: Resend | null = null;

// Default sender - projects should override this
const DEFAULT_FROM = 'Alawein <noreply@alawein.com>';

/**
 * Get or create Resend client instance
 */
export function createResendClient(apiKey?: string): Resend {
  const key = apiKey || getEnvVar('RESEND_API_KEY');

  if (!key) {
    throw new Error('Resend API key not found. ' + 'Set RESEND_API_KEY environment variable.');
  }

  return new Resend(key);
}

/**
 * Get singleton Resend client
 */
function getResendClient(): Resend {
  if (!resendInstance) {
    resendInstance = createResendClient();
  }
  return resendInstance;
}

/**
 * Send a single email
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResponse> {
  const resend = getResendClient();

  const { data, error } = await resend.emails.send({
    from: options.from || DEFAULT_FROM,
    to: Array.isArray(options.to) ? options.to : [options.to],
    subject: options.subject,
    html: options.html,
    text: options.text,
    reply_to: options.replyTo,
    cc: options.cc ? (Array.isArray(options.cc) ? options.cc : [options.cc]) : undefined,
    bcc: options.bcc ? (Array.isArray(options.bcc) ? options.bcc : [options.bcc]) : undefined,
    attachments: options.attachments?.map((a) => ({
      filename: a.filename,
      content: a.content,
      content_type: a.contentType,
    })),
    tags: options.tags,
    headers: options.headers,
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }

  if (!data) {
    throw new Error('No response data from Resend');
  }

  return {
    id: data.id,
    from: options.from || DEFAULT_FROM,
    to: Array.isArray(options.to) ? options.to : [options.to],
    created_at: new Date().toISOString(),
  };
}

/**
 * Send multiple emails in batch
 */
export async function sendBatchEmails(options: BatchEmailOptions): Promise<BatchEmailResponse> {
  const resend = getResendClient();

  const emails = options.emails.map((email) => ({
    from: email.from || DEFAULT_FROM,
    to: Array.isArray(email.to) ? email.to : [email.to],
    subject: email.subject,
    html: email.html,
    text: email.text,
    reply_to: email.replyTo,
    tags: email.tags,
  }));

  const { data, error } = await resend.batch.send(emails);

  if (error) {
    return { data: [], error: new Error(error.message) };
  }

  return {
    data: (data?.data || []).map((item) => ({
      id: item.id,
      from: DEFAULT_FROM,
      to: [],
      created_at: new Date().toISOString(),
    })),
    error: null,
  };
}

/**
 * Verify email domain (for custom domains)
 */
export async function verifyDomain(domain: string): Promise<{ verified: boolean }> {
  const resend = getResendClient();

  const { data, error } = await resend.domains.verify(domain);

  if (error) {
    throw new Error(`Failed to verify domain: ${error.message}`);
  }

  return { verified: data?.status === 'verified' };
}
