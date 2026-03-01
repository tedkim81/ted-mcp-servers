import { shuffle } from "./rng.js";
import type { Pairing } from "../types.js";

/**
 * Creates a 1:1 mapping of players to items using seeded Fisher-Yates shuffle.
 */
export function createMapping(
  players: string[],
  items: string[],
  seed: string
): Pairing[] {
  const shuffledItems = shuffle(items, seed);
  return players.map((player, i) => ({ player, item: shuffledItems[i] }));
}
