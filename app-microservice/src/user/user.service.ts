import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepositoryProtocol } from './db/typeorm/protocol/user-repository.protocol';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepositoryProtocol')
    private readonly userRepository: UserRepositoryProtocol,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    await user.createUser(createUserDto);
    return await this.userRepository.create(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  async findByMail(email: string): Promise<User> {
    return await this.userRepository.findByMail(email);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne(id);
    user.updateUser(updateUserDto);
    return await this.userRepository.update(id, user);
  }

  async remove(id: number): Promise<void> {
    return await this.userRepository.remove(id);
  }
}
