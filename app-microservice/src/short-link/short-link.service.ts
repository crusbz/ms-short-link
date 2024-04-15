import { Inject, Injectable } from '@nestjs/common';
import { ShortLink } from './entities/short-link.entity';
import { ShortLinkRepositoryProtocol } from './db/typeorm/protocol/short-link-repository.protocol';
import { CreateShortLinkDto } from './dto/create-short-link.dto';
import { UpdateShortLinkDto } from './dto/update-short-link.dto';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class ShortLinkService {
  constructor(
    @Inject('ShortLinkRepositoryProtocol')
    private readonly shortLinkRepository: ShortLinkRepositoryProtocol,
    @InjectQueue('clicks') private readonly clicksQueue: Queue,
  ) {}
  async create(createShortLinkLinkDto: CreateShortLinkDto): Promise<ShortLink> {
    const shortLink = new ShortLink();
    shortLink.createShortLink(createShortLinkLinkDto);
    return await this.shortLinkRepository.create(shortLink);
  }

  async findAll(userId: number): Promise<ShortLink[]> {
    return await this.shortLinkRepository.findAll(userId);
  }

  async findByShortenedLink(code: string): Promise<ShortLink> {
    const shortLink = new ShortLink();
    const url = shortLink.setDomainInShortenedLink(code);
    const response = await this.shortLinkRepository.findOneByShortenedLink(url);
    console.log(response);
    await this.clicksQueue.add(
      'click',
      {
        id: response.id,
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
    return response;
  }

  async updateTargetLinkByUser(
    id: number,
    userId: number,
    updateshortLinkDto: UpdateShortLinkDto,
  ): Promise<ShortLink> {
    const shortLink = await this.shortLinkRepository.findShortLinkByUser(
      id,
      userId,
    );
    shortLink.updateShortLink(updateshortLinkDto);
    return await this.shortLinkRepository.updateByUser(id, userId, shortLink);
  }

  async updateCount(id: number): Promise<ShortLink> {
    const shortLink = await this.shortLinkRepository.findShortLinkById(id);
    shortLink.addCount();
    return await this.shortLinkRepository.updateCount(id, shortLink.count);
  }

  async remove(id: number, userId: number): Promise<void> {
    return await this.shortLinkRepository.remove(id, userId);
  }
}
