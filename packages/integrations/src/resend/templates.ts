/**
 * Email Template System
 *
 * Provides a simple template registry and rendering system.
 */

import { sendEmail } from './client.js';
import type { EmailTemplate, TemplateEmailOptions, EmailResponse } from './types.js';

// Template registry
const templates = new Map<string, EmailTemplate>();

/**
 * Register an email template
 */
export function registerTemplate<TData = Record<string, unknown>>(template: EmailTemplate<TData>): void {
  templates.set(template.id, template as EmailTemplate);
}

/**
 * Get a registered template
 */
export function getTemplate<TData = Record<string, unknown>>(templateId: string): EmailTemplate<TData> | undefined {
  return templates.get(templateId) as EmailTemplate<TData> | undefined;
}

/**
 * Send an email using a registered template
 */
export async function sendTemplateEmail<TData = Record<string, unknown>>(
  templateId: string,
  options: TemplateEmailOptions<TData>,
): Promise<EmailResponse> {
  const template = getTemplate<TData>(templateId);

  if (!template) {
    throw new Error(`Email template not found: ${templateId}`);
  }

  const subject = typeof template.subject === 'function' ? template.subject(options.data) : template.subject;

  const html = template.html(options.data);
  const text = template.text?.(options.data);

  return sendEmail({
    to: options.to,
    subject,
    html,
    text,
    from: options.from || template.from,
    replyTo: options.replyTo,
    cc: options.cc,
    bcc: options.bcc,
    tags: options.tags,
  });
}

// ============================================
// Pre-built Templates
// ============================================

/**
 * Welcome email template
 */
registerTemplate({
  id: 'welcome',
  name: 'Welcome Email',
  subject: (data: { name: string }) => `Welcome to Alawein, ${data.name}!`,
  html: (data: { name: string; email: string; verificationUrl?: string }) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">Welcome, ${data.name}! 🎉</h1>
          <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
            Thank you for joining us. We're excited to have you on board.
          </p>
          ${
            data.verificationUrl
              ? `
            <p style="margin: 30px 0;">
              <a href="${data.verificationUrl}" 
                 style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Verify Email
              </a>
            </p>
          `
              : ''
          }
          <p style="color: #6a6a6a; font-size: 14px;">
            If you have any questions, just reply to this email.
          </p>
        </div>
      </body>
    </html>
  `,
  text: (data: { name: string; verificationUrl?: string }) =>
    `Welcome, ${data.name}!\n\nThank you for joining us.${data.verificationUrl ? `\n\nVerify your email: ${data.verificationUrl}` : ''}`,
});

/**
 * Password reset template
 */
registerTemplate({
  id: 'password-reset',
  name: 'Password Reset',
  subject: 'Reset Your Password',
  html: (data: { name: string; resetUrl: string; expiresIn: string }) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Password</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">Reset Your Password</h1>
          <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
            Hi ${data.name}, we received a request to reset your password.
          </p>
          <p style="margin: 30px 0;">
            <a href="${data.resetUrl}" 
               style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Reset Password
            </a>
          </p>
          <p style="color: #6a6a6a; font-size: 14px;">
            This link expires in ${data.expiresIn}. If you didn't request this, ignore this email.
          </p>
        </div>
      </body>
    </html>
  `,
  text: (data: { name: string; resetUrl: string; expiresIn: string }) =>
    `Hi ${data.name},\n\nReset your password: ${data.resetUrl}\n\nThis link expires in ${data.expiresIn}.`,
});
