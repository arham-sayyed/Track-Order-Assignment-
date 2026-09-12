import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Order, OrderStatus } from '../types/order';

export interface OrdersState {
  orders: Order[]; // newest first
}

const initialState: OrdersState = { orders: [] };

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    orderPlaced(state, action: PayloadAction<Order>) {
      state.orders.unshift(action.payload);
    },
    orderStatusAdvanced(state, action: PayloadAction<{ id: string; status: OrderStatus }>) {
      const target = state.orders.find((o) => o.id === action.payload.id);
      if (target) target.status = action.payload.status;
    },
  },
});

export const { orderPlaced, orderStatusAdvanced } = ordersSlice.actions;
export default ordersSlice.reducer;
