import { JwtStrategy } from '../strategies/jwt.strategy';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(() => {
    jwtStrategy = new JwtStrategy();
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  it('should validate and return user payload', async () => {
    const payload = { user: 'test@example.com', sub: 123 };
    const result = await jwtStrategy.validate(payload);
    expect(result).toBeDefined();
    expect(result).toEqual({ id: payload.sub, user: payload.user });
  });
});
