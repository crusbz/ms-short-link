import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortLinkService } from './short-link.service';
import { ShortLinkRepository } from './db/typeorm/repositories/short-link.repository';
import { ShortLinkModel } from './db/typeorm/models/short-link.model';
import { ShortLinkController } from './short-link.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BullModule } from '@nestjs/bull';
import { ClickProcessor } from './click-processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShortLinkModel]),
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
    BullModule.registerQueue({
      name: 'clicks',
    }),
  ],
  controllers: [ShortLinkController],
  providers: [
    ShortLinkService,
    {
      provide: 'ShortLinkRepositoryProtocol',
      useClass: ShortLinkRepository,
    },
    ClickProcessor,
  ],
  exports: [ShortLinkService],
})
export class ShortLinkModule {}
