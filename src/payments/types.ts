export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet';

/** Mirrors the options object of react-native-razorpay's RazorpayCheckout.open(). */
export interface PaymentOptions {
  amount: number; // paise, integer
  currency: 'INR';
  name: string;
  description: string;
  orderId?: string;
  prefill?: { email?: string; contact?: string; name?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
}

/** Mirrors the resolve payload of RazorpayCheckout.open(). */
export interface PaymentSuccess {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  method: PaymentMethod;
}

export interface PaymentError {
  code: 'PAYMENT_CANCELLED' | 'PAYMENT_FAILED' | 'GATEWAY_NOT_CONFIGURED';
  description: string;
}

export interface PaymentGateway {
  open(options: PaymentOptions): Promise<PaymentSuccess>;
}
