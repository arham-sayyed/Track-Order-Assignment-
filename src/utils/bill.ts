import type { CartLine } from '../types/fnb';
import type { Bill } from '../types/order';

const round2 = (n: number): number => Math.round(n * 100) / 100;

const TAX_RATE = 0.05;
const CONVENIENCE_FEE = 20;

/** Pure bill math for the checkout screen. See Global Constraints for the formula. */
export function computeBill(lines: CartLine[]): Bill {
  const subtotal = round2(lines.reduce((sum, l) => sum + l.item.price * l.qty, 0));
  const tax = round2(subtotal * TAX_RATE);
  const convenienceFee = subtotal > 0 ? CONVENIENCE_FEE : 0;
  const total = round2(subtotal + tax + convenienceFee);
  return { subtotal, tax, convenienceFee, total };
}
