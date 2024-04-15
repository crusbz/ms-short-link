import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { UserInMemoryRepository } from '../db/in-memory/user-in-memory.repository';

const clientModuleAuth = {
  get: jest.fn().mockResolvedValue({}),
};

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: 'UserRepositoryProtocol',
          useValue: new UserInMemoryRepository(),
        },
        {
          provide: 'AUTH_CLIENT',
          useValue: clientModuleAuth,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create user', async () => {
    const user = await controller.create({
      name: 'JohnDoe',
      email: 'JohnDoe@example.com',
      password: '123456',
    });
    expect(user.name).toEqual('JohnDoe');
    expect(user.email).toEqual('JohnDoe@example.com');
    expect(user.password).toBeDefined();
  });

  it('should find user by id', async () => {
    const user = await controller.findById('1');
    expect(user.name).toEqual('John Doe');
    expect(user.email).toEqual('johndoe@example.com');
    expect(user.password).toBeDefined();
  });

  it('should find user by email', async () => {
    const user = await controller.findUserByMail({
      email: 'johndoe@example.com',
    });
    expect(user.name).toEqual('John Doe');
    expect(user.email).toEqual('johndoe@example.com');
    expect(user.password).toBeDefined();
  });
});
