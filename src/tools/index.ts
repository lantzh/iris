import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SendEmailSchema, sendEmail } from './gmail.js';
import { SendSmsSchema, sendSms } from './sms.js';

export function registerTools(server: McpServer): void {
  server.tool(
    'send_email',
    'Send an email via Gmail',
    {
      to: SendEmailSchema.shape.to,
      subject: SendEmailSchema.shape.subject,
      body: SendEmailSchema.shape.body,
    },
    async (params) => {
      try {
        const result = await sendEmail(SendEmailSchema.parse(params));
        return { content: [{ type: 'text' as const, text: result }] };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { content: [{ type: 'text' as const, text: `Error: ${errorMessage}` }], isError: true };
      }
    }
  );

  server.tool(
    'send_sms',
    'Send an SMS via Twilio',
    {
      to: SendSmsSchema.shape.to,
      body: SendSmsSchema.shape.body,
    },
    async (params) => {
      try {
        const result = await sendSms(SendSmsSchema.parse(params));
        return { content: [{ type: 'text' as const, text: result }] };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { content: [{ type: 'text' as const, text: `Error: ${errorMessage}` }], isError: true };
      }
    }
  );
}
