describe('paymentGateway factory', () => {
  it('is the simulated gateway when unconfigured', () => {
    jest.isolateModules(() => {
      jest.doMock('../config', () => ({ isRazorpayConfigured: false, razorpayKeyId: '' }));
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { paymentGateway } = require('../index');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { simulatedGateway } = require('../simulatedGateway');
      expect(paymentGateway).toBe(simulatedGateway);
    });
  });

  it('is the razorpay gateway when configured', () => {
    jest.isolateModules(() => {
      jest.doMock('../config', () => ({ isRazorpayConfigured: true, razorpayKeyId: 'rzp_test_x' }));
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { paymentGateway } = require('../index');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { razorpayGateway } = require('../razorpayGateway');
      expect(paymentGateway).toBe(razorpayGateway);
    });
  });
});
