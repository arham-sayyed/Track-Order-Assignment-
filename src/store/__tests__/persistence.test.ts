import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeStore } from '../index';
import { loadPersistedOrders, STORAGE_KEY } from '../persistence';
import { orderPlaced } from '../ordersSlice';
import type { Order } from '../../types/order';

const order = (id: string): Order => ({
  id, createdAt: 1, lines: [],
  bill: { subtotal: 0, tax: 0, convenienceFee: 0, total: 0 },
  payment: { gateway: 'razorpay', paymentId: 'pay_x', method: 'upi', status: 'paid' },
  status: 'PLACED', token: 'A1', cinema: { name: 'n', screen: 's', seats: 'g' },
});

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.useRealTimers();
});

describe('persistence', () => {
  it('writes orders to AsyncStorage after orderPlaced (debounced)', async () => {
    jest.useFakeTimers();
    const store = makeStore();
    store.dispatch(orderPlaced(order('a')));
    await jest.advanceTimersByTimeAsync(400);
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    expect(JSON.parse(raw as string).map((o: Order) => o.id)).toEqual(['a']);
  });

  it('loadPersistedOrders round-trips', async () => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([order('a'), order('b')]));
    const state = await loadPersistedOrders();
    expect(state?.orders.map((o) => o.id)).toEqual(['a', 'b']);
  });

  it('loadPersistedOrders returns undefined on malformed JSON', async () => {
    await AsyncStorage.setItem(STORAGE_KEY, '{not json');
    expect(await loadPersistedOrders()).toBeUndefined();
  });

  it('loadPersistedOrders returns undefined when nothing is stored', async () => {
    expect(await loadPersistedOrders()).toBeUndefined();
  });
});
