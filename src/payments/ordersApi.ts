import { paymentsApiBaseUrl } from './config';
import type { PaymentError } from './types';

export interface CreatedOrder {
  order_id: string;
  amount: number;
  currency: string;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const orderCreateFailed: PaymentError = {
  code: 'PAYMENT_FAILED',
  description: 'Could not start payment — order service unreachable.',
};

const verificationFailed: PaymentError = {
  code: 'PAYMENT_FAILED',
  description: 'Payment could not be verified. Contact support before retrying.',
};

/** Backend order-creation call — must happen before RazorpayCheckout.open(). */
export async function createOrder(
  amount: number,
  currency: string,
  receipt: string,
): Promise<CreatedOrder> {
  const res = await fetch(`${paymentsApiBaseUrl}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, currency, receipt }),
  });
  if (!res.ok) return Promise.reject(orderCreateFailed);
  return res.json();
}

/** Backend signature-verification call — must happen after a successful checkout. */
export async function verifyPayment(req: VerifyPaymentRequest): Promise<void> {
  const res = await fetch(`${paymentsApiBaseUrl}/orders/${req.razorpay_order_id}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) return Promise.reject(verificationFailed);
  const data = (await res.json()) as { verified: boolean };
  if (!data.verified) return Promise.reject(verificationFailed);
}
