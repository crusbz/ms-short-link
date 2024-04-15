import { Injectable } from '@nestjs/common';
import { ShortLinkRepositoryProtocol } from '../typeorm/protocol/short-link-repository.protocol';
import { ShortLink } from './../../../short-link/entities/short-link.entity';
import { ShortLinkDtoToDBMapper } from '../typeorm/dto/short-link-to-db.dto';

@Injectable()
export class ShortLinkInMemoryRepository
  implements ShortLinkRepositoryProtocol
{
  constructor() {
    this.shortLink = new ShortLink();
    this.shortLink.setShortLink({
      id: 1,
      targetLink: 'https://www.google.com.br',
      shortenedLink: 'localhost:3000/1W2b34',
      userId: 1,
      count: 0,
      createdAt: new Date('2024-04-14T15:25:32.530Z'),
      updatedAt: null,
      deletedAt: null,
    });
    this.data.push(this.shortLink);
  }

  private shortLink: ShortLink;
  private data: ShortLink[] = [];
  async create(item: ShortLink) {
    item.count = 0;
    item.id = 2;
    this.data.push(item);
    const shortLink = new ShortLink();
    const createdShortLink = new ShortLinkDtoToDBMapper(item);
    shortLink.setShortLink({ ...createdShortLink, count: 0, id: 2 });
    return shortLink;
  }

  async findAll(userId: number) {
    return this.data.filter((shortLink) => shortLink.userId === userId);
  }

  async findShortLinkById(id: number): Promise<ShortLink> {
    return this.data.find((item) => item['id'] === id);
  }

  async findShortLinkByUser(id: number, userId: number): Promise<ShortLink> {
    return this.data.find(
      (item) => item['id'] === id && item['userId'] === userId,
    );
  }

  async findOneByShortenedLink(shortLink: string): Promise<ShortLink> {
    console.log(shortLink);
    return this.data.find((item) => item['shortenedLink'] === shortLink);
  }

  async updateByUser(
    id: number,
    userId: number,
    item: ShortLink,
  ): Promise<ShortLink> {
    const index = this.data.findIndex(
      (i) => i['id'] === id && i['userId'] === userId,
    );
    this.data[index] = item;
    const shortLink = new ShortLink();
    shortLink.setShortLink(this.data[index]);
    return shortLink;
  }

  async updateCount(id: number, count: number): Promise<ShortLink> {
    this.data = this.data.map((item) => {
      if (item['id'] === id) {
        item['count'] = count;
      }
      return item;
    });
    return this.data.find((item) => item['id'] === id);
  }

  async remove(id: number) {
    this.data = this.data.filter((item) => item['id'] !== id);
  }
}
