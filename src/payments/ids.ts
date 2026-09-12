const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/** Razorpay-shaped fake payment id, e.g. "pay_9Kd3lXm2Qp8ZaB". */
export function makePaymentId(): string {
  let s = '';
  for (let i = 0; i < 14; i++) s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return `pay_${s}`;
}
