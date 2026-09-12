import type { RootState } from '../store';
import type { Order } from '../types/order';

export const selectOrders = (state: RootState): Order[] => state.orders.orders;

export const selectOrderById =
  (id: string) =>
  (state: RootState): Order | undefined =>
    state.orders.orders.find((o) => o.id === id);
