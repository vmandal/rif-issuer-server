import SMTPService from '@services/smtp.service';

let mailService;
const emailTo = 'test@test.com',
  emailSubject = 'Testing',
  emailBody = 'Test content';

describe('Mail service configuration .env file', () => {
  test('get EMAIL_FROM', () => {
    expect(process.env.EMAIL_FROM).toBeDefined();
  });
  test('get SMTP_HOST', () => {
    expect(process.env.SMTP_HOST).toBeDefined();
  });
  test('get SMTP_PORT', () => {
    expect(process.env.SMTP_PORT).toBeDefined();
  });
});

describe('Testing Mail service', () => {
  test('Sending a test mail...', () => {
    mailService = new SMTPService({
      from: process.env.EMAIL_FROM,
      SmtpServerConnectionString: `smtp://${process.env.SMTP_HOST}:${process.env.SMTP_PORT}`,
    });
    return mailService.sendMail(emailTo, emailSubject, emailBody).then(msg => {
      expect(msg).toContain('Message Sent');
    });
  });
});
