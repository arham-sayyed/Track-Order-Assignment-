import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { OrderConfirmationScreen } from '../index';
import { makeStore } from '../../../store';
import { orderPlaced } from '../../../store/ordersSlice';
import type { Order } from '../../../types/order';

const order: Order = {
  id: 'INX20260909-0001', createdAt: Date.now(), lines: [],
  bill: { subtotal: 200, tax: 10, convenienceFee: 20, total: 230 },
  payment: { gateway: 'razorpay', paymentId: 'pay_abcdefabcdef', method: 'upi', status: 'paid' },
  status: 'PLACED', token: 'B12', cinema: { name: 'INOX', screen: 'S3', seats: 'G1' },
};

const replace = jest.fn();
const popToTop = jest.fn();
const nav = { replace, popToTop } as never;

it('shows the payment id, amount and token, and navigates to tracking', () => {
  const store = makeStore();
  store.dispatch(orderPlaced(order));
  render(
    <Provider store={store}>
      <OrderConfirmationScreen navigation={nav} route={{ key: 'k', name: 'OrderConfirmation', params: { orderId: order.id } } as never} />
    </Provider>,
  );

  expect(screen.getByText('₹230.00')).toBeVisible();
  expect(screen.getByText(/pay_abcdefabcdef/)).toBeVisible();
  expect(screen.getByText('B12')).toBeVisible();

  fireEvent.press(screen.getByText('Track my order'));
  expect(replace).toHaveBeenCalledWith('OrderStatus', { orderId: order.id });
});
