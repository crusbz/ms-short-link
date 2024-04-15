import { Injectable } from '@nestjs/common';
import { UserRepositoryProtocol } from 'src/user/db/typeorm/protocol/user-repository.protocol';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserInMemoryRepository implements UserRepositoryProtocol {
  constructor() {
    this.user = new User();
    this.user.setUser({
      id: 1,
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '$2b$10$crgYV/5lBDXP29230V9bFu0L0fUUM8.mbOusaIgToh1HpPMqjG7Oe',
      createdAt: new Date('2024-04-14T15:25:32.530Z'),
      updatedAt: null,
      deletedAt: null,
    });
    this.data.push(this.user);
  }

  private user: User;
  private data: User[] = [];
  async create(item: User) {
    this.data.push(item);
    return item;
  }

  async findAll() {
    return this.data;
  }

  async findOne(id: number) {
    const response = this.data.find((item) => item['id'] === id);
    const user = new User();
    user.setUser(response);
    return user;
  }

  async findByMail(email: string) {
    return this.data.find((item) => item['email'] === email);
  }

  async remove(id: number) {
    this.data = this.data.filter((item) => item['id'] !== id);
  }

  async update(id: number, item: User) {
    const index = this.data.findIndex((i) => i['id'] === id);
    this.data[index] = item;
    const user = new User();
    user.setUser(this.data[index]);
    return user;
  }
}
