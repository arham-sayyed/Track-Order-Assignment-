import RazorpayCheckout, { type SuccessResponse } from 'react-native-razorpay';
import { razorpayKeyId } from './config';
import { createOrder, verifyPayment } from './ordersApi';
import type { PaymentGateway, PaymentOptions, PaymentSuccess } from './types';

/**
 * Real adapter. Runs `POST /orders` to get a real Razorpay order_id, opens the
 * native Checkout with it, then runs `POST /orders/:id/verify` to confirm the
 * signature server-side before resolving. See server/ for the backend.
 */
export const razorpayGateway: PaymentGateway = {
  async open(options: PaymentOptions): Promise<PaymentSuccess> {
    if (!razorpayKeyId) {
      return Promise.reject({
        code: 'GATEWAY_NOT_CONFIGURED',
        description: 'Razorpay not configured. Set RAZORPAY_KEY_ID in .env and rebuild.',
      });
    }

    const order = await createOrder(options.amount, options.currency, `inox_${Date.now()}`);

    let data: SuccessResponse;
    try {
      data = await RazorpayCheckout.open({
        key: razorpayKeyId,
        order_id: order.order_id,
        ...options,
      });
    } catch (e) {
      // react-native-razorpay rejects with { code, description } on both user
      // cancellation and hard failure; without the native module present in
      // this environment the two can't be told apart reliably, so both map to
      // PAYMENT_FAILED with the SDK's own description.
      const err = e as { description?: string };
      return Promise.reject({
        code: 'PAYMENT_FAILED',
        description: err.description ?? 'Payment failed. Try another method.',
      });
    }

    await verifyPayment({
      razorpay_order_id: data.razorpay_order_id,
      razorpay_payment_id: data.razorpay_payment_id,
      razorpay_signature: data.razorpay_signature,
    });

    return {
      razorpay_payment_id: data.razorpay_payment_id,
      razorpay_order_id: data.razorpay_order_id,
      razorpay_signature: data.razorpay_signature,
      method: 'card',
    };
  },
};
