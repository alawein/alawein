/**
 * Resend Email Type Definitions
 */

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: EmailAttachment[];
  tags?: EmailTag[];
  headers?: Record<string, string>;
}

export interface EmailAttachment {
  filename: string;
  content: string | Buffer;
  contentType?: string;
}

export interface EmailTag {
  name: string;
  value: string;
}

export interface EmailResponse {
  id: string;
  from: string;
  to: string[];
  created_at: string;
}

export interface BatchEmailOptions {
  emails: EmailOptions[];
}

export interface BatchEmailResponse {
  data: EmailResponse[];
  error: Error | null;
}

export interface EmailTemplate<TData = Record<string, unknown>> {
  id: string;
  name: string;
  subject: string | ((data: TData) => string);
  html: (data: TData) => string;
  text?: (data: TData) => string;
  from?: string;
}

export interface TemplateEmailOptions<TData = Record<string, unknown>> {
  to: string | string[];
  data: TData;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  tags?: EmailTag[];
}

// Common template data types
export interface WelcomeEmailData {
  name: string;
  email: string;
  verificationUrl?: string;
}

export interface PasswordResetData {
  name: string;
  resetUrl: string;
  expiresIn: string;
}

export interface InvoiceEmailData {
  customerName: string;
  invoiceNumber: string;
  amount: string;
  currency: string;
  dueDate: string;
  invoiceUrl: string;
}

export interface NotificationEmailData {
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
}
