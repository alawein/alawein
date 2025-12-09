/**
 * Resend Email Integration
 *
 * Provides transactional email functionality.
 *
 * @example
 * ```ts
 * import { sendEmail, sendTemplateEmail } from '@alawein/integrations/resend';
 *
 * // Send a simple email
 * await sendEmail({
 *   to: 'user@example.com',
 *   subject: 'Welcome!',
 *   html: '<h1>Welcome to our platform</h1>',
 * });
 *
 * // Send using a template
 * await sendTemplateEmail('welcome', {
 *   to: 'user@example.com',
 *   data: { name: 'John' },
 * });
 * ```
 */

export { sendEmail, sendBatchEmails, createResendClient } from './client.js';
export { sendTemplateEmail, registerTemplate, getTemplate } from './templates.js';
export type { EmailOptions, EmailTemplate, EmailResponse, BatchEmailOptions } from './types.js';
