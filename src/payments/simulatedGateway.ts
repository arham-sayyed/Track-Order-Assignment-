import { paymentController } from './paymentController';
import type { PaymentGateway, PaymentOptions, PaymentSuccess } from './types';

/** Active whenever no Razorpay key is configured. UI is driven by <PaymentHost/>. */
export const simulatedGateway: PaymentGateway = {
  open(options: PaymentOptions): Promise<PaymentSuccess> {
    return paymentController.request(options);
  },
};
