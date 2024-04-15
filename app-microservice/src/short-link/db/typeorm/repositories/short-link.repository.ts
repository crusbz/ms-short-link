import { ShortLinkRepositoryProtocol } from '../protocol/short-link-repository.protocol';
import { InjectRepository } from '@nestjs/typeorm';
import { ShortLinkModel } from '../models/short-link.model';
import { Repository } from 'typeorm';
import { ShortLink } from 'src/short-link/entities/short-link.entity';
import { NotFoundException } from '@nestjs/common';
import { ShortLinkDtoToDBMapper } from '../dto/short-link-to-db.dto';

export class ShortLinkRepository implements ShortLinkRepositoryProtocol {
  constructor(
    @InjectRepository(ShortLinkModel)
    private readonly repository: Repository<ShortLinkModel>,
  ) {}

  async create(shortLink: Partial<ShortLink>): Promise<ShortLink> {
    const instanceShortLink = new ShortLink();
    instanceShortLink.setShortLink(
      await this.repository.save(new ShortLinkDtoToDBMapper(shortLink)),
    );
    return instanceShortLink;
  }
  async findAll(userId: number): Promise<ShortLink[]> {
    const ShortLinks = await this.repository.find({
      where: { deletedAt: null, userId },
      order: { id: 'ASC' },
    });
    return ShortLinks.map((shortLink) => {
      const instanceShortLink = new ShortLink();
      instanceShortLink.setShortLink(shortLink);
      return instanceShortLink;
    });
  }
  async findShortLinkByUser(id: number, userId: number): Promise<ShortLink> {
    const instanceShortLink = new ShortLink();
    const response = await this.repository.findOneBy({ id, userId });
    if (!response) {
      throw new NotFoundException('Short link not found');
    }
    instanceShortLink.setShortLink(response);
    return instanceShortLink;
  }

  async findShortLinkById(id: number): Promise<ShortLink> {
    const response = await this.repository.findOneBy({ id });
    if (!response) {
      throw new NotFoundException('Short link not found');
    }
    const instanceShortLink = new ShortLink();
    instanceShortLink.setShortLink(response);
    return instanceShortLink;
  }

  async findOneByShortenedLink(shortLink: string): Promise<ShortLink> {
    const response = await this.repository.findOneBy({
      shortenedLink: shortLink,
      deletedAt: null,
    });

    if (!response) {
      throw new NotFoundException('Short link not found');
    }

    const instanceShortLink = new ShortLink();
    instanceShortLink.setShortLink(response);
    return instanceShortLink;
  }
  async updateByUser(
    id: number,
    userId: number,
    shortLink: Partial<ShortLink>,
  ): Promise<ShortLink> {
    const instanceShortLink = new ShortLink();
    await this.repository.update(id, new ShortLinkDtoToDBMapper(shortLink));
    instanceShortLink.setShortLink(
      await this.repository.findOneBy({ id, userId }),
    );
    return instanceShortLink;
  }

  async updateCount(id: number, count: number): Promise<ShortLink> {
    await this.repository.update(id, { count, updatedAt: new Date() });
    const instanceShortLink = new ShortLink();
    instanceShortLink.setShortLink(await this.repository.findOneBy({ id }));
    return instanceShortLink;
  }

  async remove(id: number, userId: number): Promise<void> {
    const response = await this.repository.softDelete({ id, userId });
    if (!response.affected) {
      throw new NotFoundException('Short link not found');
    }
  }
}
