import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';

let mockClientProxy: jest.Mocked<ClientProxy>;
let mockJwtService: jest.Mocked<JwtService>;
jest.mock('bcrypt');

describe('AuthController', () => {
  let controller: AuthController;

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
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an access token', async () => {
    const user = {
      id: 1,
      email: 'test@example.com',
      password: '$2b$10$UNXU2bFegrAJQ0CpRI053u9SDTfRWL/FHSon5tOUY025WpVOIDxTO',
    } as any;

    const result = await controller.login({ user });
    expect(result).toEqual({
      userId: 1,
      accessToken: 'fakeToken',
    });
  });

  it('should return an access token', async () => {
    const user = {
      id: 1,
      email: 'test@example.com',
      password: '$2b$10$UNXU2bFegrAJQ0CpRI053u9SDTfRWL/FHSon5tOUY025WpVOIDx1O',
    } as any;

    const result = await controller.login({ user });
    expect(result).toEqual({
      userId: 1,
      accessToken: 'fakeToken',
    });
  });

  it("should validate token and return user's id", async () => {
    const result = await controller.loggedIn({ jwt: 'fakeToken' });
    expect(result).toEqual({
      userId: 1,
    });
  });
});
