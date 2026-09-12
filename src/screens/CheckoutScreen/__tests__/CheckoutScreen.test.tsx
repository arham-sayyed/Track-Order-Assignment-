import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CheckoutScreen } from '../index';
import { makeStore } from '../../../store';
import { increment } from '../../../store/cartSlice';
import { getAllFnbItems } from '../../../data/fnbRepository';

// `paymentGateway` is exported as a `const` (not a getter), so
// `jest.spyOn(payments, 'paymentGateway', 'get')` cannot work here. Mock the
// module instead, keeping the real `toPaymentOptions` helper.
jest.mock('../../../payments', () => ({
  ...jest.requireActual('../../../payments'),
  paymentGateway: {
    open: jest.fn().mockResolvedValue({ razorpay_payment_id: 'pay_x0000000000', method: 'upi' }),
  },
}));

const metrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

const replace = jest.fn();
const goBack = jest.fn();
const nav = { replace, goBack } as never;

beforeEach(() => {
  replace.mockClear();
  goBack.mockClear();
});

const renderWith = (store: ReturnType<typeof makeStore>) =>
  render(
    <Provider store={store}>
      <SafeAreaProvider initialMetrics={metrics}>
        <CheckoutScreen navigation={nav} route={{ key: 'k', name: 'Checkout' } as never} />
      </SafeAreaProvider>
    </Provider>,
  );

describe('CheckoutScreen', () => {
  it('disables Pay when the cart is empty', () => {
    renderWith(makeStore());
    expect(screen.getByText('Pay ₹0.00')).toBeDisabled();
  });

  it('places an order and navigates on a successful payment', async () => {
    const first = getAllFnbItems()[0];
    const store = makeStore();
    store.dispatch(increment(first.id));

    renderWith(store);
    fireEvent.press(screen.getByText(new RegExp(`Pay ₹`)));

    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith(
        'OrderConfirmation',
        expect.objectContaining({ orderId: expect.stringMatching(/^INX\d{8}-\d{4}$/) }),
      ),
    );
    expect(store.getState().orders.orders).toHaveLength(1);
    expect(store.getState().cart.quantities).toEqual({});
  });
});
