import { z } from "zod";
import { getGame, updateGame } from "../core/game-store.js";

export const revealNextInputSchema = {
  gameId: z
    .string()
    .min(1)
    .describe("The game ID returned by create_game"),
};

export async function handleRevealNext(args: { gameId: string }) {
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

  if (game.revealMode !== "one-by-one") {
    return {
      content: [
        {
          type: "text" as const,
          text: `This game uses "all at once" reveal mode. All results are already shown.`,
        },
      ],
      isError: true,
    };
  }

  if (game.revealedCount >= game.mapping.length) {
    return {
      content: [
        {
          type: "text" as const,
          text: `All ${game.mapping.length} pairs have been revealed!`,
        },
      ],
    };
  }

  const current = game.mapping[game.revealedCount];
  const newRevealedCount = game.revealedCount + 1;
  updateGame(args.gameId, { revealedCount: newRevealedCount });

  const remainingCount = game.mapping.length - newRevealedCount;

  return {
    content: [
      {
        type: "text" as const,
        text: `Revealed: ${current.player} → ${current.item} (${remainingCount} remaining)`,
      },
    ],
  };
}
