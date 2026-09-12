describe('payments/config', () => {
  it('is unconfigured when no key is set', () => {
    jest.isolateModules(() => {
      jest.doMock('react-native-config', () => ({ __esModule: true, default: {} }));
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { isRazorpayConfigured, razorpayKeyId } = require('../config');
      expect(razorpayKeyId).toBe('');
      expect(isRazorpayConfigured).toBe(false);
    });
  });

  it('is configured when RAZORPAY_KEY_ID is present', () => {
    jest.isolateModules(() => {
      jest.doMock('react-native-config', () => ({
        __esModule: true,
        default: { RAZORPAY_KEY_ID: 'rzp_test_abc' },
      }));
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { isRazorpayConfigured, razorpayKeyId } = require('../config');
      expect(razorpayKeyId).toBe('rzp_test_abc');
      expect(isRazorpayConfigured).toBe(true);
    });
  });

  it('defaults paymentsApiBaseUrl to localhost:4000 when unset', () => {
    jest.isolateModules(() => {
      jest.doMock('react-native-config', () => ({ __esModule: true, default: {} }));
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { paymentsApiBaseUrl } = require('../config');
      expect(paymentsApiBaseUrl).toBe('http://localhost:4000');
    });
  });
});
