import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * The SINGLE SOURCE OF TRUTH for quantities.
 *
 * Every list in the app (main food list, horizontal repeat list, cart bottom
 * sheet) reads quantity from here and dispatches these same actions. That is
 * what keeps the three views in sync (assignment requirements 3, 4, 5) with
 * no extra wiring.
 *
 * Shape: `{ [FnbItem.id]: quantity }`. An id is absent when its qty is 0.
 */
export interface CartState {
  quantities: Record<string, number>;
}

const initialState: CartState = { quantities: {} };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    increment(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.quantities[id] = (state.quantities[id] ?? 0) + 1;
    },
    decrement(state, action: PayloadAction<string>) {
      const id = action.payload;
      const next = (state.quantities[id] ?? 0) - 1;
      if (next <= 0) delete state.quantities[id];
      else state.quantities[id] = next;
    },
    setQuantity(state, action: PayloadAction<{ id: string; qty: number }>) {
      const { id, qty } = action.payload;
      if (qty <= 0) delete state.quantities[id];
      else state.quantities[id] = qty;
    },
    clearCart(state) {
      state.quantities = {};
    },
  },
});

export const { increment, decrement, setQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
