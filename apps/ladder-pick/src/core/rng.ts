/**
 * Seeded pseudo-random number generator (mulberry32 algorithm).
 * Produces deterministic sequences for reproducible shuffles.
 */
function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash >>> 0;
}

export function createRng(seed: string): () => number {
  let state = hashSeed(seed);

  return function next(): number {
    state += 0x6d2b79f5;
    let z = state;
    z = Math.imul(z ^ (z >>> 15), z | 1);
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateSeed(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}

/**
 * Fisher-Yates shuffle using the seeded RNG.
 */
export function shuffle<T>(arr: T[], seed: string): T[] {
  const result = [...arr];
  const rng = createRng(seed);

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}
