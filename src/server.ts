import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { registerTools } from "./tools/index.js";

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.IRIS_API_KEY;

if (!API_KEY) {
  console.error("ERROR: IRIS_API_KEY environment variable is required");
  process.exit(1);
}

// Create Express app
const app = express();
app.use(express.json());

// API key authentication middleware
const authenticateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const providedKey = req.headers["x-api-key"] || req.query.key;

  if (!providedKey || providedKey !== API_KEY) {
    res.status(401).json({ error: "Unauthorized: Invalid or missing API key" });
    return;
  }

  next();
};

// Apply authentication middleware to all routes
if (process.env.DISABLE_AUTH !== "true") {
  app.use(authenticateApiKey);
}

//Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", server: "iris", version: "1.0.0" });
});

async function handleMcpRequest(req: Request, res: Response): Promise<void> {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  const mcpServer = new McpServer({ name: "iris", version: "1.0.0" });
  registerTools(mcpServer);
  await mcpServer.connect(transport);
  await transport.handleRequest(req, res, req.body);
}

app.post("/mcp", handleMcpRequest);
app.get("/mcp", handleMcpRequest);
app.delete("/mcp", handleMcpRequest);

// Start the server and keep reference to prevent exit
const server = app.listen(PORT, () => {
  console.log(`🌸 Iris MCP Server running on port ${PORT}`);
  console.log(`📍 MCP endpoint: http://localhost:${PORT}/mcp`);
  console.log(`🔒 API key authentication enabled`);
});
