import { User } from 'src/user/entities/user.entity';

export interface UserRepositoryProtocol {
  create(user: Partial<User>): Promise<User>;
  findAll(): Promise<User[]>;
  findOne(id: number): Promise<User>;
  findByMail(email: string): Promise<User>;
  update(id: number, user: Partial<User>): Promise<User>;
  remove(id: number): Promise<void>;
}
