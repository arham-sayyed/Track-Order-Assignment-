const request = require('supertest');
const crypto = require('crypto');
const { createApp } = require('../app');

describe('POST /orders/:orderId/verify', () => {
  const keySecret = 'test_secret';
  beforeEach(() => {
    process.env.RAZORPAY_KEY_SECRET = keySecret;
  });

  it('returns verified: true for a correctly signed payment', async () => {
    const orderId = 'order_1';
    const paymentId = 'pay_1';
    const signature = crypto
      .createHmac('sha256', keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const res = await request(createApp())
      .post(`/orders/${orderId}/verify`)
      .send({ razorpay_payment_id: paymentId, razorpay_signature: signature });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ verified: true });
  });

  it('returns verified: false for a bad signature', async () => {
    const res = await request(createApp())
      .post('/orders/order_1/verify')
      .send({ razorpay_payment_id: 'pay_1', razorpay_signature: 'bad' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ verified: false });
  });

  it('400s when required fields are missing', async () => {
    const res = await request(createApp()).post('/orders/order_1/verify').send({});
    expect(res.status).toBe(400);
  });
});

describe('POST /orders', () => {
  it('400s when required fields are missing', async () => {
    const res = await request(createApp()).post('/orders').send({});
    expect(res.status).toBe(400);
  });
});
