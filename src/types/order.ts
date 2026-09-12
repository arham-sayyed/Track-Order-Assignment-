import type { FoodType } from './fnb';

export type OrderStatus = 'PLACED' | 'PREPARING' | 'READY' | 'COLLECTED';

export interface Bill {
  subtotal: number;
  tax: number;
  convenienceFee: number;
  total: number;
}

export interface OrderLine {
  id: string;
  name: string;
  qty: number;
  price: number;
  foodType: FoodType;
  imageUri: string;
}

export interface Order {
  id: string;
  createdAt: number;
  lines: OrderLine[];
  bill: Bill;
  payment: {
    gateway: 'razorpay';
    paymentId: string;
    method: import('../payments/types').PaymentMethod;
    status: 'paid';
  };
  status: OrderStatus;
  token: string;
  cinema: { name: string; screen: string; seats: string };
}
