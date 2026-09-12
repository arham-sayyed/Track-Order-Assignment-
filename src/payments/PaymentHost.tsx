import { useEffect, useState } from 'react';
import { RazorpaySheet } from '../components/payment/RazorpaySheet';
import { makePaymentId } from './ids';
import { paymentController, type PendingRequest } from './paymentController';
import type { PaymentMethod } from './types';

/**
 * Mounted once at the root. Renders the simulated Razorpay sheet whenever a
 * payment request is pending, and settles the controller promise from the
 * sheet's callbacks. Renders nothing when idle.
 */
export function PaymentHost() {
  const [pending, setPending] = useState<PendingRequest | null>(paymentController.getPending());

  useEffect(() => paymentController.subscribe(setPending), []);

  if (!pending) return null;

  const onPaid = (method: PaymentMethod) =>
    paymentController.resolve({ razorpay_payment_id: makePaymentId(), method });
  const onDismiss = () =>
    paymentController.reject({ code: 'PAYMENT_CANCELLED', description: 'Payment cancelled by user' });
  const onFail = () =>
    paymentController.reject({ code: 'PAYMENT_FAILED', description: 'Payment failed. Try another method.' });

  return (
    <RazorpaySheet options={pending.options} onPaid={onPaid} onDismiss={onDismiss} onFail={onFail} />
  );
}
