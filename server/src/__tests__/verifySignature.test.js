const crypto = require('crypto');
const { verifySignature } = require('../verifySignature');

describe('verifySignature', () => {
  const keySecret = 'test_secret';
  const orderId = 'order_ABC123';
  const paymentId = 'pay_XYZ789';

  it('accepts a correctly signed payment', () => {
    const signature = crypto
      .createHmac('sha256', keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
    expect(verifySignature({ orderId, paymentId, signature, keySecret })).toBe(true);
  });

  it('rejects a tampered signature', () => {
    expect(
      verifySignature({ orderId, paymentId, signature: 'not-the-real-signature', keySecret }),
    ).toBe(false);
  });
});
