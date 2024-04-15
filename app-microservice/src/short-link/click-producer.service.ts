import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class ClickProducerService {
  constructor(@InjectQueue('clicks') private readonly clicksQueue: Queue) {}

  async sendClick(id: number): Promise<void> {
    await this.clicksQueue.add(
      'click',
      {
        id,
      },
      {
        removeOnComplete: {
          age: 60 * 10, // keep up to 10 minutes
          count: 10, // keep up to 1000 jobs
        },
        removeOnFail: {
          age: 24 * 3600, // keep up to 24 hours
        },
      },
    );
  }
}
