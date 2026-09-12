import { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';
import { RootNavigator } from './src/navigation/RootNavigator';
import { PaymentHost } from './src/payments/PaymentHost';
import { loadPersistedOrders } from './src/store/persistence';
import { makeStore, type AppStore } from './src/store';

/**
 * Provider stack (outermost -> innermost):
 *   Redux            -- cart + filter state
 *   GestureHandler   -- required by @gorhom/bottom-sheet
 *   SafeArea         -- notch / status-bar insets
 *   Navigation       -- inside RootNavigator
 *
 * The store is built after `loadPersistedOrders()` resolves so persisted order
 * history is available as `preloadedState`; `null` is rendered until then.
 */
export default function App() {
  const [store, setStore] = useState<AppStore | null>(null);

  useEffect(() => {
    let active = true;
    loadPersistedOrders().then((persisted) => {
      if (active) setStore(makeStore(persisted ? { orders: persisted } : undefined));
    });
    return () => {
      active = false;
    };
  }, []);

  if (!store) return null; // brief; splash screen stays up

  return (
    <ReduxProvider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar barStyle="dark-content" />
          <RootNavigator />
          <PaymentHost />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ReduxProvider>
  );
}
