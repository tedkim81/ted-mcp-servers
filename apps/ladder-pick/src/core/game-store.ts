import type { GameState } from "../types.js";

const store = new Map<string, GameState>();

export function setGame(game: GameState): void {
  store.set(game.gameId, game);
}

export function getGame(gameId: string): GameState | undefined {
  return store.get(gameId);
}

export function updateGame(
  gameId: string,
  updates: Partial<GameState>
): GameState | undefined {
  const existing = store.get(gameId);
  if (!existing) return undefined;
  const updated = { ...existing, ...updates };
  store.set(gameId, updated);
  return updated;
}
