import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  registerAppResource,
  registerAppTool,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";

import { createGameInputSchema, handleCreateGame } from "./tools/create-game.js";
import { reshuffleInputSchema, handleReshuffle } from "./tools/reshuffle.js";
import { revealNextInputSchema, handleRevealNext } from "./tools/reveal-next.js";
import { exportResultInputSchema, handleExportResult } from "./tools/export-result.js";

const widgetHtml = readFileSync(
  new URL("../public/ladder-widget.html", import.meta.url),
  "utf8"
);

const WIDGET_URI = "ui://widget/ladder.html";

const TOOL_HINTS = {
  readOnlyHint: false,
  destructiveHint: false,
  openWorldHint: false,
} as const;

function createLadderServer(): McpServer {
  const server = new McpServer({
    name: "ladder-pick",
    version: "1.0.0",
  });

  registerAppResource(
    server,
    "ladder-widget",
    WIDGET_URI,
    {},
    async () => ({
      contents: [
        {
          uri: WIDGET_URI,
          mimeType: RESOURCE_MIME_TYPE,
          text: widgetHtml,
        },
      ],
    })
  );

  registerAppTool(
    server,
    "create_game",
    {
      title: "Create ladder game",
      description:
        "Creates a random 1:1 matching between player labels and item labels for entertainment. Inputs must be non-sensitive labels or nicknames only — never real personal names, health data, financial information, or other sensitive personal information.",
      inputSchema: createGameInputSchema,
      annotations: TOOL_HINTS,
      _meta: {
        ui: { resourceUri: WIDGET_URI },
      },
    },
    async (args) =>
      handleCreateGame({
        players: args.players as string[],
        items: args.items as string[],
        seed: args.seed as string | undefined,
        revealMode: (args.revealMode as "all" | "one-by-one") ?? "all",
      })
  );

  registerAppTool(
    server,
    "reshuffle",
    {
      title: "Reshuffle",
      description:
        "Re-randomizes the matching of an existing ladder game with a new seed.",
      inputSchema: reshuffleInputSchema,
      annotations: TOOL_HINTS,
      _meta: {
        ui: { resourceUri: WIDGET_URI },
      },
    },
    async (args) =>
      handleReshuffle({
        gameId: args.gameId as string,
        seed: args.seed as string | undefined,
      })
  );

  registerAppTool(
    server,
    "reveal_next",
    {
      title: "Reveal next",
      description:
        "Reveals the next player-item pair in a one-by-one reveal mode game.",
      inputSchema: revealNextInputSchema,
      annotations: TOOL_HINTS,
      _meta: {
        ui: { resourceUri: WIDGET_URI },
      },
    },
    async (args) =>
      handleRevealNext({
        gameId: args.gameId as string,
      })
  );

  registerAppTool(
    server,
    "export_result",
    {
      title: "Export result",
      description:
        "Returns the game result as plain text or JSON so the user can copy it.",
      inputSchema: exportResultInputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
      _meta: {
        ui: { resourceUri: WIDGET_URI },
      },
    },
    async (args) =>
      handleExportResult({
        gameId: args.gameId as string,
        format: args.format as "text" | "json",
      })
  );

  return server;
}

const port = Number(process.env.PORT ?? 8787);
const MCP_PATH = "/mcp";

const ALLOWED_ORIGINS = new Set([
  "https://chatgpt.com",
  "https://chat.openai.com",
]);

function isAllowedOrigin(origin: string): boolean {
  if (ALLOWED_ORIGINS.has(origin)) return true;
  try {
    const { hostname } = new URL(origin);
    return hostname.endsWith(".chatgpt.com") || hostname.endsWith(".openai.com");
  } catch {
    return false;
  }
}

function getCorsHeaders(requestOrigin?: string): Record<string, string> {
  const origin =
    requestOrigin && isAllowedOrigin(requestOrigin)
      ? requestOrigin
      : "https://chatgpt.com";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
    "Access-Control-Allow-Headers": "content-type, mcp-session-id",
    "Access-Control-Expose-Headers": "Mcp-Session-Id",
    Vary: "Origin",
  };
}

const httpServer = createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400).end("Missing URL");
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);

  const reqOrigin = req.headers.origin;

  if (req.method === "OPTIONS") {
    res.writeHead(204, getCorsHeaders(reqOrigin)).end();
    return;
  }

  if (req.method === "GET" && url.pathname === "/") {
    res
      .writeHead(200, { "content-type": "text/plain" })
      .end("Ladder Pick MCP server is running");
    return;
  }

  const MCP_METHODS = new Set(["POST", "GET", "DELETE"]);
  if (
    url.pathname === MCP_PATH &&
    req.method &&
    MCP_METHODS.has(req.method)
  ) {
    Object.entries(getCorsHeaders(reqOrigin)).forEach(([k, v]) =>
      res.setHeader(k, v)
    );
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'none'; frame-ancestors 'self' https://chatgpt.com https://*.chatgpt.com"
    );

    const server = createLadderServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    res.on("close", () => {
      transport.close();
      server.close();
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res);
    } catch (error) {
      console.error("Error handling MCP request:", error);
      if (!res.headersSent) {
        res.writeHead(500).end("Internal server error");
      }
    }
    return;
  }

  res.writeHead(404).end("Not Found");
});

httpServer.listen(port, () => {
  console.log(
    `Ladder Pick MCP server listening on http://localhost:${port}${MCP_PATH}`
  );
});
