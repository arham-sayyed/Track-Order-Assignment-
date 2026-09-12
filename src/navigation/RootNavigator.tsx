import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { OrderConfirmationScreen } from '../screens/OrderConfirmationScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { OrderStatusScreen } from '../screens/OrderStatusScreen';
import { TrackOrderScreen } from '../screens/TrackOrderScreen';

export type RootStackParamList = {
  TrackOrder: undefined;
  Checkout: undefined;
  OrderConfirmation: { orderId: string };
  OrderStatus: { orderId: string };
  Orders: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Stack root. All five screens are registered.
 */
export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TrackOrder" component={TrackOrderScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
        <Stack.Screen name="OrderStatus" component={OrderStatusScreen} />
        <Stack.Screen name="Orders" component={OrdersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
