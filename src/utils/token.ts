const LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // no I/O — avoid counter-display confusion

/** Human-readable pickup token for the F&B counter, e.g. "A42". Not unique — display only. */
export function makePickupToken(): string {
  const letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
  const number = Math.floor(1 + Math.random() * 99);
  return `${letter}${number}`;
}
