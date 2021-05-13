import App from '@app';
import IssuerRoute from '@routes/issuer.route';
import IssuerService from '@services/issuer.service';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('IssuerService Tests', () => {
  const issuerRoute = new IssuerRoute();
  const app = new App([issuerRoute]);

  it('Store new code in DB', async () => {
    await app.getServer();
    const issuerService = new IssuerService();
    const newEntry = await issuerService.createDidCode({ did: '123456', code: 'xyz', asset: 'test@test.com' });
    expect(newEntry.id).toBeGreaterThan(0);
  });

  it('Code expire test', async () => {
    await app.getServer();
    const issuerService = new IssuerService();
    process.env = Object.assign(process.env, { CODE_EXPIRE_TIME: 1 }); // 1 millisecond
    const readEntry = await issuerService.getDidCodeAsset({ did: '123456', code: 'xyz' }); // also deletes the entry
    expect(readEntry).toBeNull;
  });

  it('Code can be used only once', async () => {
    await app.getServer();
    const issuerService = new IssuerService();
    await issuerService.createDidCode({ did: '1234567', code: 'xyz', asset: 'test@test.com' });
    process.env = Object.assign(process.env, { CODE_EXPIRE_TIME: 3600000 }); // restore

    const readEntry = await issuerService.getDidCodeAsset({ did: '1234567', code: 'xyz' }); // also deletes the entry
    expect(readEntry.asset).toMatch('test@test.com');

    const readEntryAgain = await issuerService.getDidCodeAsset({ did: '1234567', code: 'xyz' });
    expect(readEntryAgain).toBeNull;
  });

  test('get Issuer instance', () => {
    const issuerService = new IssuerService();
    const issuer = issuerService.getIssuer();
    expect(issuer).toBeDefined();
  });
});
