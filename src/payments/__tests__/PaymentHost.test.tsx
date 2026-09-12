import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaymentHost } from '../PaymentHost';
import { paymentController } from '../paymentController';
import type { PaymentOptions } from '../types';

const opts: PaymentOptions = {
  amount: 28250, currency: 'INR', name: 'INOX F&B', description: '2 items · INOX Nariman Point, Mumbai',
};

const renderHost = () =>
  render(
    <SafeAreaProvider
      initialMetrics={{ frame: { x: 0, y: 0, width: 0, height: 0 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}
    >
      <PaymentHost />
    </SafeAreaProvider>,
  );

describe('PaymentHost', () => {
  afterEach(() => jest.useRealTimers());

  it('renders nothing until a request is pending', () => {
    renderHost();
    expect(screen.queryByText(/Pay ₹/)).toBeNull();
  });

  it('shows the sheet with the amount and resolves open() on Pay', async () => {
    jest.useFakeTimers();
    renderHost();
    let result: unknown;
    act(() => {
      paymentController.request(opts).then((r) => (result = r));
    });
    expect(screen.getByText('Pay ₹282.50')).toBeVisible();

    fireEvent.press(screen.getByText('Pay ₹282.50'));
    await act(async () => {
      await jest.advanceTimersByTimeAsync(1300);
    });
    expect(result).toMatchObject({ razorpay_payment_id: expect.stringMatching(/^pay_/), method: 'upi' });
  });

  it('rejects open() with PAYMENT_CANCELLED on Cancel', async () => {
    renderHost();
    let rejection!: Promise<unknown>;
    act(() => {
      rejection = paymentController.request(opts).catch((e) => e);
    });
    fireEvent.press(screen.getByText('Cancel'));
    await expect(rejection).resolves.toMatchObject({ code: 'PAYMENT_CANCELLED' });
  });

  it('rejects open() with PAYMENT_FAILED on Simulate failure', async () => {
    renderHost();
    let rejection!: Promise<unknown>;
    act(() => {
      rejection = paymentController.request(opts).catch((e) => e);
    });
    fireEvent.press(screen.getByText('Simulate failure'));
    await expect(rejection).resolves.toMatchObject({ code: 'PAYMENT_FAILED' });
  });
});
