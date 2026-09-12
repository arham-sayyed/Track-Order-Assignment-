import { makePickupToken } from '../token';

describe('makePickupToken', () => {
  it('is a letter followed by 1–2 digits', () => {
    for (let i = 0; i < 50; i++) {
      expect(makePickupToken()).toMatch(/^[A-Z]([1-9]|[1-9][0-9])$/);
    }
  });

  it('varies across calls', () => {
    const seen = new Set(Array.from({ length: 40 }, () => makePickupToken()));
    expect(seen.size).toBeGreaterThan(1);
  });
});
