import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamablehttp.js';
import { registerTools } from './tools/index.js';

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.IRIS_API_KEY;

if (!API_KEY) {
  console.error('ERROR: IRIS_API_KEY environment variable is required');
  process.exit(1);
}

// Create Express app
const app = express();

// API key authentication middleware
const authenticateApiKey = (req: Request, res: Response, next: NextFunction): void => {
  const providedKey = req.headers['x-api-key'];

  if (!providedKey || providedKey !== API_KEY) {
    res.status(401).json({ error: 'Unauthorized: Invalid or missing API key' });
    return;
  }

  next();
};

// Apply authentication middleware to all routes
app.use(authenticateApiKey);

// Create MCP server instance
const mcpServer = new McpServer({
  name: 'iris',
  version: '1.0.0',
});

// Register all tools
registerTools(mcpServer);

// Create StreamableHTTPServerTransport
const transport = new StreamableHTTPServerTransport({
  endpoint: '/mcp',
  app,
});

// Connect the MCP server to the transport
await mcpServer.connect(transport);

// Health check endpoint (also requires auth)
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', server: 'iris', version: '1.0.0' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🌸 Iris MCP Server running on port ${PORT}`);
  console.log(`📍 MCP endpoint: http://localhost:${PORT}/mcp`);
  console.log(`🔒 API key authentication enabled`);
});
