import { z } from "zod";
import { getGame } from "../core/game-store.js";

export const exportResultInputSchema = {
  gameId: z.string().min(1).describe("The game ID returned by create_game"),
  format: z
    .enum(["text", "json"])
    .describe('Output format: "text" for a human-readable table, "json" for structured data'),
};

export async function handleExportResult(args: {
  gameId: string;
  format: "text" | "json";
}) {
  const game = getGame(args.gameId);
  if (!game) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Game not found: ${args.gameId}. Please create a new game.`,
        },
      ],
      isError: true,
    };
  }

  let output: string;

  if (args.format === "json") {
    output = JSON.stringify(
      {
        gameId: game.gameId,
        seed: game.seed,
        revealMode: game.revealMode,
        mapping: game.mapping,
      },
      null,
      2
    );
  } else {
    const header = "Player → Item";
    const separator = "─".repeat(40);
    const rows = game.mapping
      .map((p, i) => `${i + 1}. ${p.player} → ${p.item}`)
      .join("\n");
    output = `Ladder Pick Results\n${separator}\n${header}\n${separator}\n${rows}\n${separator}\nSeed: ${game.seed}`;
  }

  return {
    content: [{ type: "text" as const, text: output }],
    structuredContent: { output },
  };
}
