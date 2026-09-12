import { render, screen } from '@testing-library/react-native';
import { OrderCard } from '../OrderCard';
import type { Order } from '../../../types/order';

const order = (over: Partial<Order>): Order => ({
  id: 'INX20260101-0001',
  createdAt: Date.now(),
  lines: [{ id: 'i', name: 'x', qty: 1, price: 100, foodType: 'VEG', imageUri: '' }],
  bill: { subtotal: 100, tax: 5, convenienceFee: 20, total: 125 },
  payment: { gateway: 'razorpay', paymentId: 'pay_1', method: 'upi', status: 'paid' },
  status: 'PLACED',
  token: 'C7',
  cinema: { name: 'n', screen: 's', seats: 'g' },
  ...over,
});

describe('OrderCard', () => {
  it('shows the time-derived stage when it is ahead of the stored status', () => {
    render(
      <OrderCard order={order({ status: 'PLACED', createdAt: Date.now() - 120_000 })} onPress={() => {}} />,
    );
    expect(screen.getByText('Ready')).toBeVisible();
  });

  it('shows the stored status for a fresh order', () => {
    render(<OrderCard order={order({ status: 'PLACED', createdAt: Date.now() })} onPress={() => {}} />);
    expect(screen.getByText('Placed')).toBeVisible();
  });
});
