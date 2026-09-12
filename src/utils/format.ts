/** `500` -> `"₹500"` — used in the lists. */
export function formatPrice(amount: number): string {
  return `₹${Math.round(amount)}`;
}

/** `385` -> `"₹385.00"` — used in the cart (matches the reference design). */
export function formatAmount(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

/**
 * Whole-number discount percentage off `mrp`. Returns 0 when there is no
 * saving (equal prices, missing/zero mrp, or price above mrp).
 * `discountPercent(100, 179)` -> `44`.
 */
export function discountPercent(price: number, mrp: number): number {
  if (!Number.isFinite(price) || !Number.isFinite(mrp) || mrp <= 0 || price >= mrp) {
    return 0;
  }
  return Math.round(((mrp - price) / mrp) * 100);
}
