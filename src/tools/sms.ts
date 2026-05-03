import { z } from "zod";
import { getTwilioClient } from "../auth/twilio.js";

export const SendSmsSchema = z.object({
  to: z.string().describe("Recipient phone number"),
  body: z.string().describe("Message text"),
});

export type SendSmsParams = z.infer<typeof SendSmsSchema>;

export async function sendSms(params: SendSmsParams): Promise<string> {
  const { to, body } = params;

  const from = process.env.TWILIO_FROM_NUMBER;
  if (!from) {
    throw new Error("Missing required TWILIO_FROM_NUMBER environment variable.");
  }

  const client = getTwilioClient();

  try {
    const message = await client.messages.create({ body, from, to });
    return `SMS sent successfully to ${to}. Message SID: ${message.sid}`;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to send SMS: ${errorMessage}`);
  }
}
