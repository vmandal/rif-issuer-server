describe('SMS service configuration .env file', () => {
  test('get TWILIO_ACCOUNT_SID', () => {
    expect(process.env.TWILIO_ACCOUNT_SID).toBeDefined();
  });
  test('get TWILIO_AUTH_TOKEN', () => {
    expect(process.env.TWILIO_AUTH_TOKEN).toBeDefined();
  });
});
