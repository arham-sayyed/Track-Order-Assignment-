import type { PaymentError, PaymentOptions, PaymentSuccess } from './types';

export interface PendingRequest {
  options: PaymentOptions;
}

interface Internal extends PendingRequest {
  resolve: (r: PaymentSuccess) => void;
  reject: (e: PaymentError) => void;
}

let pending: Internal | null = null;
let subscriber: (p: PendingRequest | null) => void = () => {};

/**
 * Module-level bridge between `simulatedGateway.open()` (returns a promise) and
 * `<PaymentHost/>` (renders the sheet). Mirrors how the native SDK opens its own
 * activity: the caller only ever awaits a promise.
 */
export const paymentController = {
  request(options: PaymentOptions): Promise<PaymentSuccess> {
    return new Promise<PaymentSuccess>((resolve, reject) => {
      pending = { options, resolve, reject };
      subscriber({ options });
    });
  },
  subscribe(fn: (p: PendingRequest | null) => void): () => void {
    subscriber = fn;
    return () => {
      subscriber = () => {};
    };
  },
  getPending(): PendingRequest | null {
    return pending ? { options: pending.options } : null;
  },
  resolve(result: PaymentSuccess): void {
    const p = pending;
    pending = null;
    subscriber(null);
    p?.resolve(result);
  },
  reject(error: PaymentError): void {
    const p = pending;
    pending = null;
    subscriber(null);
    p?.reject(error);
  },
};
