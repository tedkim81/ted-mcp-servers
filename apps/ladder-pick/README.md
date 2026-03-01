# Ladder Pick

A ChatGPT App that provides random 1:1 matching (ladder game) inside ChatGPT via an interactive widget.

## Features

- **Interactive widget** rendered in an iframe inside ChatGPT
- **Players & Items input** with Add/Remove UI
- **Reveal modes**: All at once, or one by one
- **Reproducible results** via optional seed
- **Reshuffle** with a new seed
- **Export** results as text or JSON

## Tech Stack

- Node.js + TypeScript
- `@modelcontextprotocol/sdk` — MCP server framework
- `@modelcontextprotocol/ext-apps` — Apps SDK helpers
- `zod` — input validation
- Vanilla HTML/CSS/JS widget (no build step for UI)

## Project Structure

```
apps/ladder-pick/
├── public/
│   └── ladder-widget.html   # ChatGPT iframe widget
├── src/
│   ├── server.ts             # MCP server entry point
│   ├── types.ts              # Shared types
│   ├── core/
│   │   ├── rng.ts            # Seeded RNG + Fisher-Yates shuffle
│   │   ├── ladder.ts         # Matching algorithm
│   │   ├── validate.ts       # Input validation
│   │   └── game-store.ts     # In-memory game state
│   └── tools/
│       ├── create-game.ts    # create_game tool
│       ├── reshuffle.ts      # reshuffle tool
│       ├── reveal-next.ts    # reveal_next tool
│       └── export-result.ts  # export_result tool
├── docs/
│   ├── privacy-policy.md
│   └── test-prompts.md
├── .env.example
├── package.json
└── tsconfig.json
```

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Build

```bash
pnpm build
```

### 3. Start the server

```bash
pnpm start
# or with a custom port:
PORT=8787 pnpm start
```

The server listens on `http://localhost:8787/mcp`.

### 4. Test with MCP Inspector

```bash
npx @modelcontextprotocol/inspector@latest --server-url http://localhost:8787/mcp --transport http
```

### 5. Expose locally with ngrok

```bash
ngrok http 8787
```

Provide the public URL (e.g. `https://<id>.ngrok.app/mcp`) when adding a connector in ChatGPT.

## MCP Tools

| Tool | Description | readOnlyHint |
|---|---|---|
| `create_game` | Create a new ladder game | false |
| `reshuffle` | Reshuffle an existing game with a new seed | false |
| `reveal_next` | Reveal the next pair (one-by-one mode) | false |
| `export_result` | Export results as text or JSON | **true** |

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `8787` | HTTP server port |

## License

ISC
