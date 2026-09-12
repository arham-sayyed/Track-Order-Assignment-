import { razorpayGateway } from '../razorpayGateway';
import * as ordersApi from '../ordersApi';

jest.mock('react-native-razorpay', () => ({ __esModule: true, default: { open: jest.fn() } }));
jest.mock('../ordersApi');
jest.mock('../config', () => ({ razorpayKeyId: '' }));

const opts = { amount: 1000, currency: 'INR' as const, name: 'x', description: 'y' };

describe('razorpayGateway (no key configured)', () => {
  it('rejects with GATEWAY_NOT_CONFIGURED without calling the order API', async () => {
    await expect(razorpayGateway.open(opts)).rejects.toMatchObject({ code: 'GATEWAY_NOT_CONFIGURED' });
    expect(ordersApi.createOrder).not.toHaveBeenCalled();
  });
});
