import Config from 'react-native-config';

/**
 * Razorpay key id. Empty by default — the app then uses the simulated gateway.
 * To go live: set RAZORPAY_KEY_ID in .env and rebuild. No code changes needed.
 */
export const razorpayKeyId: string = Config.RAZORPAY_KEY_ID ?? '';

export const isRazorpayConfigured = razorpayKeyId.length > 0;

/** Base URL of the order-creation/verification backend (see server/). */
export const paymentsApiBaseUrl: string =
  Config.PAYMENTS_API_BASE_URL ?? 'http://localhost:4000';
