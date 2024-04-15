import { Inject, Injectable } from '@nestjs/common';
import { ShortLink } from './entities/short-link.entity';
import { ShortLinkRepositoryProtocol } from './db/typeorm/protocol/short-link-repository.protocol';
import { CreateShortLinkDto } from './dto/create-short-link.dto';
import { UpdateShortLinkDto } from './dto/update-short-link.dto';
import { ClickProducerService } from './click-producer.service';

@Injectable()
export class ShortLinkService {
  constructor(
    @Inject('ShortLinkRepositoryProtocol')
    private readonly shortLinkRepository: ShortLinkRepositoryProtocol,
    private readonly clickProducerService: ClickProducerService,
  ) {}
  async create(createShortLinkLinkDto: CreateShortLinkDto): Promise<ShortLink> {
    let shortLink: ShortLink;
    shortLink = new ShortLink();
    shortLink.createShortLink(createShortLinkLinkDto);

    while (await this.hasShortened(shortLink.shortenedLink)) {
      shortLink.generateShortenedLink();
    }

    return await this.shortLinkRepository.create(shortLink);
  }

  async findAll(userId: number): Promise<ShortLink[]> {
    return await this.shortLinkRepository.findAll(userId);
  }

  async findByShortenedLink(code: string): Promise<ShortLink> {
    const shortLink = new ShortLink();
    const url = shortLink.setDomainInShortenedLink(code);
    const response = await this.shortLinkRepository.findOneByShortenedLink(url);
    await this.clickProducerService.sendClick(response.id);
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

  async hasShortened(shortenedLink: string): Promise<boolean> {
    try {
      await this.shortLinkRepository.findOneByShortenedLink(shortenedLink);
      return true;
    } catch (e) {
      return false;
    }
  }
}
