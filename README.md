# Iris

A standalone MCP (Model Context Protocol) server for sending emails via Gmail. Built with the @modelcontextprotocol/sdk and designed for deployment on Railway.

## Features

- **MCP Server Implementation**: Proper MCP server using `McpServer` class and `StreamableHTTPServerTransport`
- **Gmail Integration**: Send emails using the Gmail API with OAuth2 authentication
- **Secure API**: API key authentication via `x-api-key` header
- **Railway Ready**: Configured for seamless Railway deployment

## Tools

### `send_email`

Send an email via Gmail API.

**Parameters:**
- `to` (string, required): Recipient email address
- `subject` (string, required): Email subject line
- `body` (string, required): Email body content (plain text)

**Example:**
```json
{
  "to": "recipient@example.com",
  "subject": "Hello from Iris",
  "body": "This is a test email sent via the Iris MCP server."
}
```

## Prerequisites

1. **Node.js**: Version 18 or higher
2. **Google Cloud Project**: With Gmail API enabled
3. **Gmail OAuth2 Credentials**: Client ID, Client Secret, and Refresh Token

## Gmail OAuth Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Gmail API:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Gmail API"
   - Click "Enable"

### 2. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Configure the OAuth consent screen if prompted:
   - User Type: External (for testing) or Internal (for workspace)
   - Add required information (app name, user support email, etc.)
   - Add scopes: `https://www.googleapis.com/auth/gmail.send`
   - Add test users if using External type
4. Create OAuth client ID:
   - Application type: Web application
   - Name: Iris MCP Server
   - Authorized redirect URIs: `https://developers.google.com/oauthplayground`
5. Save the **Client ID** and **Client Secret**

### 3. Obtain Refresh Token via OAuth Playground

1. Go to [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground)
2. Click the gear icon (⚙️) in the top right
3. Check "Use your own OAuth credentials"
4. Enter your **Client ID** and **Client Secret**
5. Close the settings
6. In the left panel under "Step 1: Select & authorize APIs":
   - Scroll down to "Gmail API v1"
   - Select `https://www.googleapis.com/auth/gmail.send`
   - Click "Authorize APIs"
7. Sign in with your Google account and grant permissions
8. In "Step 2: Exchange authorization code for tokens":
   - Click "Exchange authorization code for tokens"
   - Copy the **Refresh Token** (you'll need this for the environment variables)

## Installation

### Local Development

1. Clone the repository:
```bash
git clone <your-repo-url>
cd iris
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Edit `.env` and add your credentials:
```env
GMAIL_CLIENT_ID=your-client-id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your-client-secret
GMAIL_REFRESH_TOKEN=your-refresh-token
IRIS_API_KEY=your-secure-api-key
PORT=3000
```

5. Build the project:
```bash
npm run build
```

6. Start the server:
```bash
npm start
```

Or run in development mode with hot reload:
```bash
npm run dev
```

The server will start at `http://localhost:3000`.

## Railway Deployment

### 1. Prepare Your Repository

1. Initialize git (if not already done):
```bash
git init
git add .
git commit -m "Initial commit: Iris MCP server"
```

2. Push to GitHub (or GitLab/Bitbucket):
```bash
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Deploy to Railway

1. Go to [Railway](https://railway.app)
2. Sign up or log in
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your Iris repository
6. Railway will automatically detect the Node.js project

### 3. Configure Environment Variables

In the Railway project settings, add the following environment variables:

- `GMAIL_CLIENT_ID`: Your Gmail OAuth2 Client ID
- `GMAIL_CLIENT_SECRET`: Your Gmail OAuth2 Client Secret
- `GMAIL_REFRESH_TOKEN`: Your Gmail OAuth2 Refresh Token
- `IRIS_API_KEY`: A strong, randomly generated API key for authentication
- `PORT`: Railway sets this automatically, no need to add it manually

### 4. Deploy

Railway will automatically deploy your application. Once deployed:

1. Go to "Settings" > "Networking"
2. Click "Generate Domain" to get a public URL
3. Your MCP server will be available at `https://your-app.railway.app/mcp`

## Usage

### Making MCP Requests

All requests to the MCP server must include the `x-api-key` header:

```bash
curl -X POST https://your-app.railway.app/mcp \
  -H "x-api-key: your-secure-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "send_email",
      "arguments": {
        "to": "recipient@example.com",
        "subject": "Test Email",
        "body": "This is a test email from Iris."
      }
    },
    "id": 1
  }'
```

### Health Check

Check if the server is running:

```bash
curl https://your-app.railway.app/health \
  -H "x-api-key: your-secure-api-key"
```

Response:
```json
{
  "status": "ok",
  "server": "iris",
  "version": "1.0.0"
}
```

## Project Structure

```
iris/
├── src/
│   ├── auth/
│   │   └── gmail.ts         # Gmail OAuth2 client setup
│   ├── tools/
│   │   ├── gmail.ts         # send_email tool implementation
│   │   └── index.ts         # Tool registration with MCP server
│   └── server.ts            # MCP server + Express + transport setup
├── .env.example             # Environment variable template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Security

- All endpoints require authentication via the `x-api-key` header
- OAuth2 refresh tokens are securely stored in environment variables
- Never commit `.env` files or expose your API keys
- Use strong, randomly generated API keys in production

## Troubleshooting

### Authentication Errors

If you get "Unauthorized" errors:
- Verify your `IRIS_API_KEY` is correctly set
- Ensure you're including the `x-api-key` header in all requests

### Gmail API Errors

If emails fail to send:
- Verify your Gmail OAuth credentials are correct
- Ensure the Gmail API is enabled in Google Cloud Console
- Check that your refresh token hasn't expired (test users' refresh tokens expire after 7 days)
- For production, publish your OAuth consent screen to avoid token expiration

### Token Expiration

Test users in OAuth consent screen (External, unpublished) have refresh tokens that expire after 7 days. For production:
1. Complete the OAuth consent screen verification process
2. Publish your app
3. Or use Internal user type if you have a Google Workspace

## License

ISC
