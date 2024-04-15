import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

let mockClientProxy: jest.Mocked<ClientProxy>;
let mockJwtService: jest.Mocked<JwtService>;
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    mockClientProxy = {
      send: jest.fn().mockReturnValue(
        of({
          email: 'test@example.com',
          password:
            '$2b$10$UNXU2bFegrAJQ0CpRI053u9SDTfRWL/FHSon5tOUY025WpVOIDxTO',
        }),
      ),
    } as any;

    mockJwtService = {
      sign: jest.fn().mockReturnValue('fakeToken'),
      verify: jest.fn().mockReturnValue({ userId: 1 }),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'USER_CLIENT',
          useValue: mockClientProxy,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const user = { email: 'test@example.com', password: '1234546' };
      const responseUser = {
        ...user,
        password:
          '$2b$10$UNXU2bFegrAJQ0CpRI053u9SDTfRWL/FHSon5tOUY025WpVOIDxTO',
      }; // Include hashed password

      jest.spyOn(bcrypt, 'compareSync').mockImplementation(() => {
        return true;
      });

      const result = await service.validateUser(user.email, user.password);
      expect(result).toEqual(responseUser);
    });

    it('should return null if credentials are invalid', async () => {
      const user = { email: 'test@example.com', password: '1234546' };

      jest.spyOn(bcrypt, 'compareSync').mockImplementation(() => {
        return false;
      });

      const result = await service.validateUser(user.email, 'invalidPassword');
      expect(result).toBeNull();
    });

    it('should invalid credentials return unauthorized error', async () => {
      const user = { email: 'test@example.com', password: '1234546' };
      mockClientProxy.send.mockReturnValue(null);
      try {
        await service.validateUser(user.email, 'invalidPassword');
        fail('Expected UnauthorizedException to be thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
      }
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password:
          '$2b$10$UNXU2bFegrAJQ0CpRI053u9SDTfRWL/FHSon5tOUY025WpVOIDxTO',
      };
      const result = await service.login(user);
      expect(result).toEqual({
        userId: 1,
        accessToken: 'fakeToken',
      });
    });
  });

  describe('validate token', () => {
    it('should return user id with valid token', async () => {
      const result = await service.validateToken('fakeToken');
      expect(result).toEqual({
        userId: 1,
      });
    });

    it('should return null with invalid token', async () => {
      mockJwtService.verify.mockReturnValue(null);
      const result = await service.validateToken('invalidToken');
      expect(result).toBeNull();
    });
  });
});
