import type { CartLine, FnbItem } from '../../types/fnb';
import { buildOrder, makeOrderId } from '../order';

const item: FnbItem = {
  id: 'i1', name: 'Salted Popcorn', imageUri: 'data:image/jpeg;base64,xx',
  price: 100, mrp: 150, foodType: 'VEG', category: 'POPCORN',
  isRepeat: false, calories: '', weight: '',
};
const lines: CartLine[] = [{ item, qty: 2 }];
const bill = { subtotal: 200, tax: 10, convenienceFee: 20, total: 230 };

describe('makeOrderId', () => {
  it('formats as INX<YYYYMMDD>-<4 digits>', () => {
    expect(makeOrderId(new Date('2026-09-09T10:00:00'))).toMatch(/^INX20260909-\d{4}$/);
  });
});

describe('buildOrder', () => {
  const order = buildOrder({
    lines,
    bill,
    payment: { razorpay_payment_id: 'pay_abc123', method: 'upi' },
  });

  it('snapshots cart lines into order lines', () => {
    expect(order.lines).toEqual([
      { id: 'i1', name: 'Salted Popcorn', qty: 2, price: 100, foodType: 'VEG', imageUri: 'data:image/jpeg;base64,xx' },
    ]);
  });

  it('starts PLACED with the given bill and a pickup token', () => {
    expect(order.status).toBe('PLACED');
    expect(order.bill).toEqual(bill);
    expect(order.token).toMatch(/^[A-Z]([1-9]|[1-9][0-9])$/);
  });

  it('records the payment as a paid razorpay payment', () => {
    expect(order.payment).toEqual({
      gateway: 'razorpay', paymentId: 'pay_abc123', method: 'upi', status: 'paid',
    });
  });

  it('attaches the cinema context and a fresh id/timestamp', () => {
    expect(order.cinema.name).toMatch(/INOX/);
    expect(order.id).toMatch(/^INX\d{8}-\d{4}$/);
    expect(typeof order.createdAt).toBe('number');
  });
});
