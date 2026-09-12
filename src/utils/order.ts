import type { CartLine } from '../types/fnb';
import type { Bill, Order } from '../types/order';
import { CINEMA } from '../constants/cinema';
import { makePickupToken } from './token';

/**
 * Order-reference helper for the "order placed" confirmation.
 *
 * There is no backend in this assignment — `makeOrderId` just mints a
 * human-readable local reference (`INX<YYYYMMDD>-<4 digits>`) so the success
 * screen has something concrete to show and the user has something to quote
 * at the counter.
 */
export function makeOrderId(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const suffix = String(Math.floor(1000 + Math.random() * 9000));
  return `INX${y}${m}${d}-${suffix}`;
}

export interface BuildOrderInput {
  lines: CartLine[];
  bill: Bill;
  payment: { razorpay_payment_id: string; method: string };
}

/** Assemble a full local Order from the cart, the computed bill and the gateway result. */
export function buildOrder({ lines, bill, payment }: BuildOrderInput): Order {
  return {
    id: makeOrderId(),
    createdAt: Date.now(),
    lines: lines.map((l) => ({
      id: l.item.id,
      name: l.item.name,
      qty: l.qty,
      price: l.item.price,
      foodType: l.item.foodType,
      imageUri: l.item.imageUri,
    })),
    bill,
    payment: {
      gateway: 'razorpay',
      paymentId: payment.razorpay_payment_id,
      method: payment.method as Order['payment']['method'],
      status: 'paid',
    },
    status: 'PLACED',
    token: makePickupToken(),
    cinema: { ...CINEMA },
  };
}
