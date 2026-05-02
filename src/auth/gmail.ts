import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

/**
 * Create and configure Gmail OAuth2 client
 */
export function createGmailClient(): OAuth2Client {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      'Missing required Gmail OAuth credentials. Please set GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, and GMAIL_REFRESH_TOKEN environment variables.'
    );
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'https://developers.google.com/oauthplayground' // Redirect URI used in OAuth Playground
  );

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  return oauth2Client;
}

/**
 * Get Gmail API instance with authenticated client
 */
export function getGmailApi() {
  const auth = createGmailClient();
  return google.gmail({ version: 'v1', auth });
}
