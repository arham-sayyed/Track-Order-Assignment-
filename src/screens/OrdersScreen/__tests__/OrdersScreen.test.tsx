import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { OrdersScreen } from '../index';
import { makeStore } from '../../../store';
import { orderPlaced } from '../../../store/ordersSlice';
import type { Order } from '../../../types/order';

const metrics = { frame: { x: 0, y: 0, width: 0, height: 0 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } };
const goBack = jest.fn();
const navigate = jest.fn();
const nav = { goBack, navigate } as never;

beforeEach(() => {
  goBack.mockClear();
  navigate.mockClear();
});

const order = (id: string): Order => ({
  id, createdAt: Date.now(), lines: [{ id: 'i', name: 'x', qty: 1, price: 100, foodType: 'VEG', imageUri: '' }],
  bill: { subtotal: 100, tax: 5, convenienceFee: 20, total: 125 },
  payment: { gateway: 'razorpay', paymentId: 'pay_1', method: 'upi', status: 'paid' },
  status: 'PLACED', token: 'C7', cinema: { name: 'n', screen: 's', seats: 'g' },
});

const renderWith = (store: ReturnType<typeof makeStore>) =>
  render(
    <Provider store={store}>
      <SafeAreaProvider initialMetrics={metrics}>
        <OrdersScreen navigation={nav} route={{ key: 'k', name: 'Orders' } as never} />
      </SafeAreaProvider>
    </Provider>,
  );

describe('OrdersScreen', () => {
  it('shows the empty state with no orders', () => {
    renderWith(makeStore());
    expect(screen.getByText('No orders yet')).toBeVisible();
  });

  it('lists orders newest-first and opens tracking on tap', () => {
    const store = makeStore();
    store.dispatch(orderPlaced(order('INX-1')));
    store.dispatch(orderPlaced(order('INX-2')));
    renderWith(store);

    const rows = screen.getAllByText(/^INX-/);
    expect(rows[0]).toHaveTextContent('INX-2');

    fireEvent.press(screen.getByText('INX-1'));
    expect(navigate).toHaveBeenCalledWith('OrderStatus', { orderId: 'INX-1' });
  });
});
