import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RootState } from './index';
import type { OrdersState } from './ordersSlice';
import { orderPlaced, orderStatusAdvanced } from './ordersSlice';

export const STORAGE_KEY = 'inox.orders.v1';
const DEBOUNCE_MS = 300;

export const ordersPersistenceListener = createListenerMiddleware();

ordersPersistenceListener.startListening({
  matcher: isAnyOf(orderPlaced, orderStatusAdvanced),
  effect: async (_action, api) => {
    api.cancelActiveListeners(); // debounce: newer dispatch wins
    await api.delay(DEBOUNCE_MS);
    const { orders } = (api.getState() as RootState).orders;
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // best-effort; history is a convenience, not a source of truth
    }
  },
});

/** Read persisted orders on boot. Fails open (returns undefined) on any error. */
export async function loadPersistedOrders(): Promise<OrdersState | undefined> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return undefined;
    return { orders: parsed };
  } catch {
    return undefined;
  }
}
