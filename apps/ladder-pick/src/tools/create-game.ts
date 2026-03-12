import { z } from "zod";
import { validateInputs } from "../core/validate.js";
import { createMapping } from "../core/ladder.js";
import { generateSeed } from "../core/rng.js";
import { setGame } from "../core/game-store.js";
import type { GameState } from "../types.js";

export const createGameInputSchema = {
  players: z
    .array(z.string().min(1))
    .min(2)
    .max(20)
    .describe(
      "Labels or nicknames for each participant (2–20). Must not contain real personal names or sensitive information."
    ),
  items: z
    .array(z.string().min(1))
    .min(2)
    .max(20)
    .describe(
      "Labels for items to assign — must have the same count as players. Must not contain sensitive information."
    ),
  seed: z
    .string()
    .optional()
    .describe("Optional seed for reproducible results"),
  revealMode: z
    .enum(["all", "one-by-one"])
    .default("all")
    .describe(
      'Reveal mode: "all" shows every match at once, "one-by-one" reveals one pair at a time'
    ),
};

export async function handleCreateGame(args: {
  players: string[];
  items: string[];
  seed?: string;
  revealMode: "all" | "one-by-one";
}) {
  const validation = validateInputs(args.players, args.items);
  if (!validation.ok) {
    return {
      content: [{ type: "text" as const, text: validation.message }],
      isError: true,
    };
  }

  const { players, items } = validation;
  const seed = args.seed?.trim() || generateSeed();
  const mapping = createMapping(players, items, seed);
  const gameId = crypto.randomUUID();

  const game: GameState = {
    gameId,
    players,
    items,
    seed,
    revealMode: args.revealMode,
    mapping,
    revealedCount: 0,
  };

  setGame(game);

  const structuredContent = {
    gameId,
    seed,
    revealMode: args.revealMode,
    players,
    items,
    mapping,
  };

  const textSummary =
    args.revealMode === "all"
      ? `Game created! Here are the results:\n${mapping.map((p) => `• ${p.player} → ${p.item}`).join("\n")}`
      : `Game created with ${mapping.length} pairs. Use "Reveal Next" to reveal one pair at a time.`;

  return {
    content: [{ type: "text" as const, text: textSummary }],
    structuredContent,
  };
}
