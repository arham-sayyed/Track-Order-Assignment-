const express = require('express');
const cors = require('cors');
const { makeRazorpayClient } = require('./razorpayClient');
const { verifySignature } = require('./verifySignature');

function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.post('/orders', async (req, res) => {
    const { amount, currency, receipt } = req.body ?? {};
    if (!amount || !currency || !receipt) {
      return res.status(400).json({ error: 'amount, currency and receipt are required' });
    }
    try {
      const client = makeRazorpayClient();
      const order = await client.orders.create({ amount, currency, receipt });
      res.json({ order_id: order.id, amount: order.amount, currency: order.currency });
    } catch (err) {
      res.status(502).json({ error: 'razorpay_order_create_failed', message: err.message });
    }
  });

  app.post('/orders/:orderId/verify', (req, res) => {
    const { orderId } = req.params;
    const { razorpay_payment_id: paymentId, razorpay_signature: signature } = req.body ?? {};
    if (!paymentId || !signature) {
      return res.status(400).json({ error: 'razorpay_payment_id and razorpay_signature are required' });
    }
    const verified = verifySignature({
      orderId,
      paymentId,
      signature,
      keySecret: process.env.RAZORPAY_KEY_SECRET,
    });
    res.json({ verified });
  });

  return app;
}

module.exports = { createApp };
