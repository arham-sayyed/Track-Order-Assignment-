import { paymentController } from '../paymentController';
import { simulatedGateway } from '../simulatedGateway';
import { makePaymentId } from '../ids';
import type { PaymentOptions } from '../types';

const opts: PaymentOptions = {
  amount: 28250, currency: 'INR', name: 'INOX F&B', description: '3 items',
};

describe('makePaymentId', () => {
  it('is a pay_-prefixed 14-char id', () => {
    expect(makePaymentId()).toMatch(/^pay_[A-Za-z0-9]{14}$/);
  });
});

describe('simulatedGateway', () => {
  it('resolves with whatever the controller resolves', async () => {
    const p = simulatedGateway.open(opts);
    expect(paymentController.getPending()?.options).toEqual(opts);
    paymentController.resolve({ razorpay_payment_id: 'pay_test00000000', method: 'upi' });
    await expect(p).resolves.toEqual({ razorpay_payment_id: 'pay_test00000000', method: 'upi' });
    expect(paymentController.getPending()).toBeNull();
  });

  it('rejects when the controller rejects', async () => {
    const p = simulatedGateway.open(opts);
    paymentController.reject({ code: 'PAYMENT_CANCELLED', description: 'cancelled' });
    await expect(p).rejects.toEqual({ code: 'PAYMENT_CANCELLED', description: 'cancelled' });
  });

  it('notifies subscribers on request and on settle', async () => {
    const seen: (unknown | null)[] = [];
    const unsub = paymentController.subscribe((p) => seen.push(p ? p.options : null));
    const p = simulatedGateway.open(opts);
    paymentController.resolve({ razorpay_payment_id: 'pay_aaaaaaaaaaaa', method: 'card' });
    await p;
    unsub();
    expect(seen).toEqual([opts, null]);
  });
});
