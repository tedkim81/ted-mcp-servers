import { z } from "zod";
import { generateSeed } from "../core/rng.js";
import { createMapping } from "../core/ladder.js";
import { getGame, updateGame } from "../core/game-store.js";

export const reshuffleInputSchema = {
  gameId: z.string().min(1).describe("The game ID returned by create_game"),
  seed: z
    .string()
    .optional()
    .describe("Optional new seed — omit for a random reshuffle"),
};

export async function handleReshuffle(args: {
  gameId: string;
  seed?: string;
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

  const newSeed = args.seed?.trim() || generateSeed();
  const newMapping = createMapping(game.players, game.items, newSeed);

  updateGame(args.gameId, {
    seed: newSeed,
    mapping: newMapping,
    revealedCount: 0,
  });

  const textSummary =
    game.revealMode === "all"
      ? `Reshuffled! New results:\n${newMapping.map((p) => `• ${p.player} → ${p.item}`).join("\n")}`
      : `Reshuffled! Ready to reveal ${newMapping.length} pairs one by one.`;

  return {
    content: [{ type: "text" as const, text: textSummary }],
    structuredContent: {
      gameId: args.gameId,
      seed: newSeed,
      revealMode: game.revealMode,
      players: game.players,
      items: game.items,
      mapping: newMapping,
    },
  };
}
