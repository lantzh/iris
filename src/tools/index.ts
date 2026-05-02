import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SendEmailSchema, sendEmail } from './gmail.js';

/**
 * Register all tools with the MCP server instance
 */
export function registerTools(server: McpServer): void {
  // Register send_email tool
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
        // Validate parameters with Zod
        const validatedParams = SendEmailSchema.parse(params);

        // Send email
        const result = await sendEmail(validatedParams);

        return {
          content: [
            {
              type: 'text' as const,
              text: result,
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
