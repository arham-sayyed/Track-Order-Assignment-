import RazorpayCheckout from 'react-native-razorpay';
import { razorpayGateway } from '../razorpayGateway';
import * as ordersApi from '../ordersApi';

jest.mock('react-native-razorpay', () => ({ __esModule: true, default: { open: jest.fn() } }));
jest.mock('../ordersApi');
jest.mock('../config', () => ({ razorpayKeyId: 'rzp_test_x' }));

const opts = { amount: 1000, currency: 'INR' as const, name: 'x', description: 'y' };
const checkoutOpen = RazorpayCheckout.open as jest.Mock;
const createOrder = ordersApi.createOrder as jest.Mock;
const verifyPayment = ordersApi.verifyPayment as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  createOrder.mockResolvedValue({ order_id: 'order_1', amount: 1000, currency: 'INR' });
  verifyPayment.mockResolvedValue(undefined);
});

describe('razorpayGateway', () => {
  it('creates an order, opens checkout with its order_id, then verifies and resolves', async () => {
    checkoutOpen.mockResolvedValue({
      razorpay_payment_id: 'pay_1',
      razorpay_order_id: 'order_1',
      razorpay_signature: 'sig_1',
    });

    const result = await razorpayGateway.open(opts);

    expect(createOrder).toHaveBeenCalledWith(1000, 'INR', expect.stringMatching(/^inox_/));
    expect(checkoutOpen).toHaveBeenCalledWith(expect.objectContaining({
      key: 'rzp_test_x',
      order_id: 'order_1',
      amount: 1000,
    }));
    expect(verifyPayment).toHaveBeenCalledWith({
      razorpay_order_id: 'order_1',
      razorpay_payment_id: 'pay_1',
      razorpay_signature: 'sig_1',
    });
    expect(result).toEqual({
      razorpay_payment_id: 'pay_1',
      razorpay_order_id: 'order_1',
      razorpay_signature: 'sig_1',
      method: 'card',
    });
  });

  it('rejects with PAYMENT_FAILED when checkout itself rejects', async () => {
    checkoutOpen.mockRejectedValue({ description: 'Payment Cancelled by User' });

    await expect(razorpayGateway.open(opts)).rejects.toMatchObject({
      code: 'PAYMENT_FAILED',
      description: 'Payment Cancelled by User',
    });
    expect(verifyPayment).not.toHaveBeenCalled();
  });

  it('propagates a verification failure without resolving', async () => {
    checkoutOpen.mockResolvedValue({
      razorpay_payment_id: 'pay_1',
      razorpay_order_id: 'order_1',
      razorpay_signature: 'sig_1',
    });
    verifyPayment.mockRejectedValue({ code: 'PAYMENT_FAILED', description: 'bad signature' });

    await expect(razorpayGateway.open(opts)).rejects.toMatchObject({ code: 'PAYMENT_FAILED' });
  });
});
