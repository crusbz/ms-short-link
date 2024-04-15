import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './db/typeorm/models/user.model';
import { UserRepository } from './db/typeorm/repositories/user.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserModel]),
    ClientsModule.register([
      {
        name: 'AUTH_CLIENT',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 4000,
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    { provide: 'UserRepositoryProtocol', useClass: UserRepository },
  ],
})
export class UserModule {}
