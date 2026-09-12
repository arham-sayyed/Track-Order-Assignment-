const crypto = require('crypto');

/**
 * Razorpay's documented signature scheme: HMAC-SHA256 of "order_id|payment_id"
 * using the account's key_secret, hex-encoded.
 */
function verifySignature({ orderId, paymentId, signature, keySecret }) {
  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return expected === signature;
}

module.exports = { verifySignature };
