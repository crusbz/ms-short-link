import { User } from 'src/user/entities/user.entity';
import { UserRepositoryProtocol } from '../protocol/user-repository.protocol';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from '../models/user.model';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

export class UserDtoToDBMapper {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  constructor(user: Partial<User>) {
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.deletedAt = user.deletedAt;
  }
}

export class UserRepository implements UserRepositoryProtocol {
  constructor(
    @InjectRepository(UserModel)
    private readonly repository: Repository<UserModel>,
  ) {}
  async create(user: Partial<User>): Promise<User> {
    const instanceUser = new User();
    instanceUser.setUser(
      await this.repository.save(new UserDtoToDBMapper(user)),
    );
    return instanceUser;
  }
  async findAll(): Promise<User[]> {
    const users = await this.repository.find({
      where: { deletedAt: null },
      order: { id: 'ASC' },
    });
    return users.map((user) => {
      const instanceUser = new User();
      instanceUser.setUser(user);
      return instanceUser;
    });
  }
  async findOne(id: number): Promise<User> {
    const user = await this.repository.findOne({
      where: { id },
      relations: { shortenedLinks: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const instanceUser = new User();
    instanceUser.setUser(user);
    return instanceUser;
  }

  async findByMail(email: string): Promise<User> {
    const user = await this.repository.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const instanceUser = new User();
    instanceUser.setUser(user);
    return instanceUser;
  }
  async update(id: number, user: Partial<User>): Promise<User> {
    const instanceUser = new User();
    await this.repository.update(id, new UserDtoToDBMapper(user));
    instanceUser.setUser(await this.repository.findOneBy({ id }));
    return instanceUser;
  }
  async remove(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }
}
