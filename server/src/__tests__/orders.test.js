jest.mock('../razorpayClient', () => ({
  makeRazorpayClient: () => ({
    orders: {
      create: jest.fn().mockResolvedValue({ id: 'order_mock1', amount: 1000, currency: 'INR' }),
    },
  }),
}));

const request = require('supertest');
const { createApp } = require('../app');

describe('POST /orders (Razorpay SDK mocked)', () => {
  it('creates an order and returns its id/amount/currency', async () => {
    const res = await request(createApp())
      .post('/orders')
      .send({ amount: 1000, currency: 'INR', receipt: 'receipt_1' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ order_id: 'order_mock1', amount: 1000, currency: 'INR' });
  });
});
