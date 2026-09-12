import { CINEMA } from '../constants/cinema';
import type { Bill } from '../types/order';
import { isRazorpayConfigured } from './config';
import { razorpayGateway } from './razorpayGateway';
import { simulatedGateway } from './simulatedGateway';
import type { PaymentGateway, PaymentOptions } from './types';

/** The one switch point. Screens import ONLY this. */
export const paymentGateway: PaymentGateway = isRazorpayConfigured
  ? razorpayGateway
  : simulatedGateway;

export function toPaymentOptions(bill: Bill, lineCount: number): PaymentOptions {
  return {
    amount: Math.round(bill.total * 100),
    currency: 'INR',
    name: 'INOX F&B',
    description: `${lineCount} ${lineCount === 1 ? 'item' : 'items'} · ${CINEMA.name}`,
  };
}

export type { PaymentGateway, PaymentOptions, PaymentSuccess, PaymentError, PaymentMethod } from './types';
