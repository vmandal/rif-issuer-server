import App from '@app';
import IssuerRoute from '@routes/issuer.route';
import IssuerService from '@services/issuer.service';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('IssuerService Tests', () => {
  const issuerRoute = new IssuerRoute();
  const app = new App([issuerRoute]);

  it('createDidCode', async () => {
    await app.getServer();
    const issuerService = new IssuerService();
    const dca = await issuerService.createDidCode({ did: '123456', code: 'xyz', asset: 'test@test.com' });
    expect(dca.id).toBeGreaterThan(0);
  });

  it('getDidCodeAsset', async () => {
    await app.getServer();
    const issuerService = new IssuerService();
    const dca = await issuerService.getDidCodeAsset({ did: '123456', code: 'xyz' }); // also deletes the entry
    expect(dca.asset).toMatch('test@test.com');
    const dca2 = await issuerService.getDidCodeAsset({ did: '123456', code: 'xyz' });
    expect(dca2).toBeNull;
  });
});
