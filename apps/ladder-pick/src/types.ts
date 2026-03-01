export type RevealMode = "all" | "one-by-one";

export interface Pairing {
  player: string;
  item: string;
}

export interface GameState {
  gameId: string;
  players: string[];
  items: string[];
  seed: string;
  revealMode: RevealMode;
  mapping: Pairing[];
  revealedCount: number;
  createdAt: number;
}
