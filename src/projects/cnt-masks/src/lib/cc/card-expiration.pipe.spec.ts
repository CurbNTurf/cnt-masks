import { CardExpirationPipe } from './card-expiration.pipe';

describe('CardExpirationPipe', () => {
  it('create an instance', () => {
    const pipe = new CardExpirationPipe();
    expect(pipe).toBeTruthy();
  });
});
