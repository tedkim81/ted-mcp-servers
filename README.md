# ted-mcp-servers

A monorepo hosting multiple MCP (Model Context Protocol) servers.

## Apps

| App | Port | Description |
|---|---|---|
| [ladder-pick](apps/ladder-pick/) | 8787 | Random 1:1 matching via interactive ladder game |

## Structure

```
ted-mcp-servers/
├── apps/
│   ├── ladder-pick/       # Ladder Pick MCP server
│   └── <new-app>/         # Add new apps here
├── plan.md                # Development plan (Korean)
└── README.md
```

## Quick Start

Each app is an independent Node.js project with its own `package.json`.

```bash
cd apps/ladder-pick
pnpm install
pnpm build
pnpm start
```

## Deployment

All apps are deployed to a single AWS Lightsail instance with Nginx path-based routing.
See [plan.md](plan.md) for the full deployment guide.

## Adding a New App

1. Create a new directory under `apps/`
2. Initialize the project (`pnpm init`, add dependencies)
3. Implement the MCP server
4. Deploy: register with PM2 on a new port, add Nginx location block
