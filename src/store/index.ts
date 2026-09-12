import { combineReducers, configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import filtersReducer from './filtersSlice';
import ordersReducer from './ordersSlice';
import { ordersPersistenceListener } from './persistence';

const rootReducer = combineReducers({
  cart: cartReducer,
  filters: filtersReducer,
  orders: ordersReducer,
});

export function makeStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(ordersPersistenceListener.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = {
  cart: ReturnType<typeof cartReducer>;
  filters: ReturnType<typeof filtersReducer>;
  orders: ReturnType<typeof ordersReducer>;
};
export type AppDispatch = AppStore['dispatch'];
