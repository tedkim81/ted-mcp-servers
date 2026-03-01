export interface ValidationError {
  ok: false;
  message: string;
}

export interface ValidationSuccess {
  ok: true;
  players: string[];
  items: string[];
}

export type ValidationResult = ValidationError | ValidationSuccess;

function normalizeName(name: string): string {
  return name.trim();
}

export function validateInputs(
  rawPlayers: string[],
  rawItems: string[]
): ValidationResult {
  const players = rawPlayers.map(normalizeName).filter((p) => p.length > 0);
  const items = rawItems.map(normalizeName).filter((it) => it.length > 0);

  if (players.length < 2) {
    return { ok: false, message: "At least 2 players are required." };
  }

  if (players.length > 20) {
    return { ok: false, message: "Maximum 20 players are allowed." };
  }

  if (items.length === 0) {
    return { ok: false, message: "Items list cannot be empty." };
  }

  if (items.length !== players.length) {
    return {
      ok: false,
      message: `Number of items must match number of players. You have ${players.length} players and ${items.length} items.`,
    };
  }

  return { ok: true, players, items };
}
