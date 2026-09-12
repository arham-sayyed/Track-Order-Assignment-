import { createOrder, verifyPayment } from '../ordersApi';

jest.mock('../config', () => ({ paymentsApiBaseUrl: 'http://test-server' }));

describe('ordersApi', () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('createOrder', () => {
    it('POSTs amount/currency/receipt and returns the order', async () => {
      const fetchMock = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ order_id: 'order_1', amount: 1000, currency: 'INR' }),
      });
      global.fetch = fetchMock as unknown as typeof fetch;

      const result = await createOrder(1000, 'INR', 'receipt_1');

      expect(fetchMock).toHaveBeenCalledWith(
        'http://test-server/orders',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: 1000, currency: 'INR', receipt: 'receipt_1' }),
        }),
      );
      expect(result).toEqual({ order_id: 'order_1', amount: 1000, currency: 'INR' });
    });

    it('throws PAYMENT_FAILED when the server responds with a non-2xx status', async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 502 }) as unknown as typeof fetch;

      await expect(createOrder(1000, 'INR', 'receipt_1')).rejects.toMatchObject({
        code: 'PAYMENT_FAILED',
      });
    });
  });

  describe('verifyPayment', () => {
    const req = {
      razorpay_order_id: 'order_1',
      razorpay_payment_id: 'pay_1',
      razorpay_signature: 'sig_1',
    };

    it('resolves when the server confirms verified: true', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ verified: true }),
      }) as unknown as typeof fetch;

      await expect(verifyPayment(req)).resolves.toBeUndefined();
    });

    it('rejects with PAYMENT_FAILED when the server confirms verified: false', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ verified: false }),
      }) as unknown as typeof fetch;

      await expect(verifyPayment(req)).rejects.toMatchObject({ code: 'PAYMENT_FAILED' });
    });

    it('rejects with PAYMENT_FAILED when the request itself fails', async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 }) as unknown as typeof fetch;

      await expect(verifyPayment(req)).rejects.toMatchObject({ code: 'PAYMENT_FAILED' });
    });
  });
});
