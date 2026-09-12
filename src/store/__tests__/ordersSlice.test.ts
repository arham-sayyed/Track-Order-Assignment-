import reducer, { orderPlaced, orderStatusAdvanced, type OrdersState } from '../ordersSlice';
import type { Order } from '../../types/order';

const order = (id: string): Order => ({
  id,
  createdAt: 1,
  lines: [],
  bill: { subtotal: 0, tax: 0, convenienceFee: 0, total: 0 },
  payment: { gateway: 'razorpay', paymentId: 'pay_x', method: 'upi', status: 'paid' },
  status: 'PLACED',
  token: 'A1',
  cinema: { name: 'n', screen: 's', seats: 'g' },
});

const empty: OrdersState = { orders: [] };

describe('ordersSlice', () => {
  it('prepends new orders (newest first)', () => {
    const s1 = reducer(empty, orderPlaced(order('a')));
    const s2 = reducer(s1, orderPlaced(order('b')));
    expect(s2.orders.map((o) => o.id)).toEqual(['b', 'a']);
  });

  it('advances the status of the matching order only', () => {
    const s1 = reducer(empty, orderPlaced(order('a')));
    const s2 = reducer(s1, orderStatusAdvanced({ id: 'a', status: 'PREPARING' }));
    expect(s2.orders[0].status).toBe('PREPARING');
  });

  it('ignores status advance for an unknown id', () => {
    const s1 = reducer(empty, orderPlaced(order('a')));
    const s2 = reducer(s1, orderStatusAdvanced({ id: 'zzz', status: 'READY' }));
    expect(s2).toEqual(s1);
  });
});
