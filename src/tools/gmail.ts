import { z } from 'zod';
import { getGmailApi } from '../auth/gmail.js';

/**
 * Zod schema for send_email tool parameters
 */
export const SendEmailSchema = z.object({
  to: z.string().email().describe('Recipient email address'),
  subject: z.string().describe('Email subject line'),
  body: z.string().describe('Email body content (plain text)'),
});

export type SendEmailParams = z.infer<typeof SendEmailSchema>;

/**
 * Send an email via Gmail API
 */
export async function sendEmail(params: SendEmailParams): Promise<string> {
  const { to, subject, body } = params;

  const gmail = getGmailApi();

  // Create email in RFC 2822 format
  const email = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset=utf-8',
    '',
    body,
  ].join('\n');

  // Encode email to base64url format
  const encodedEmail = Buffer.from(email)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  try {
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedEmail,
      },
    });

    return `Email sent successfully to ${to}. Message ID: ${response.data.id}`;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to send email: ${errorMessage}`);
  }
}
