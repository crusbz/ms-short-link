import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserInMemoryRepository } from '../db/in-memory/user-in-memory.repository';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'UserRepositoryProtocol',
          useValue: new UserInMemoryRepository(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user', async () => {
    const user = await service.create({
      name: 'JohnDoe',
      email: 'JohnDoe@example.com',
      password: '123456',
    });
    expect(user.name).toEqual('JohnDoe');
    expect(user.email).toEqual('JohnDoe@example.com');
    expect(user.password).toBeDefined();
    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeNull();
    expect(user.deletedAt).toBeNull();
  });

  it('should find one user', async () => {
    const user = await service.findOne(1);
    expect(user.name).toEqual('John Doe');
    expect(user.email).toEqual('johndoe@example.com');
    expect(user.password).toBeDefined();
    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeNull();
    expect(user.deletedAt).toBeNull();
  });

  it('should find user by email', async () => {
    const user = await service.findByMail('johndoe@example.com');
    expect(user.name).toEqual('John Doe');
    expect(user.email).toEqual('johndoe@example.com');
    expect(user.password).toBeDefined();
    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeNull();
    expect(user.deletedAt).toBeNull();
  });

  it('should find all users', async () => {
    const users = await service.findAll();
    expect(users.length).toBe(1);
    expect(users[0].name).toEqual('John Doe');
    expect(users[0].email).toEqual('johndoe@example.com');
    expect(users[0].password).toBeDefined();
    expect(users[0].createdAt).toBeDefined();
    expect(users[0].updatedAt).toBeNull();
    expect(users[0].deletedAt).toBeNull();
  });

  it('should update user', async () => {
    const user = await service.update(1, {
      name: 'Rafael',
      email: 'Rafael@example.com',
      password: '123456',
    });
    expect(user.name).toEqual('Rafael');
    expect(user.email).toEqual('Rafael@example.com');
    expect(user.password).toBeDefined();
    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeDefined();
    expect(user.deletedAt).toBeNull();
  });

  it('should remove user', async () => {
    const user = await service.remove(1);
    expect(user).toEqual(undefined);
  });
});
