import { Processor, Process } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ShortLinkService } from './short-link.service';

@Injectable()
@Processor('clicks')
export class ClickProcessorService {
  constructor(private readonly shortLinkService: ShortLinkService) {}

  private readonly logger = new Logger(ClickProcessorService.name);

  @Process('click')
  async execute(job: Job<{ id: number }>) {
    try {
      await this.shortLinkService.updateCount(job.data.id);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
