import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { LocalStrategy } from '../strategies/local.strategy';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: AuthService;

  const user = { id: 1, username: 'test@example.com' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn().mockResolvedValue(user), // Mock da função validateUser do AuthService
          },
        },
      ],
    }).compile();

    localStrategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(localStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user if credentials are valid', async () => {
      const username = 'test@example.com';
      const password = 'password123';

      authService.validateUser = jest.fn().mockResolvedValue(user);

      const result = await localStrategy.validate(username, password);

      expect(result).toEqual(user);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const username = 'test@example.com';
      const password = 'invalidpassword';

      authService.validateUser = jest.fn();

      await expect(localStrategy.validate(username, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
