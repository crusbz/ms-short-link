import { ShortLink } from 'src/short-link/entities/short-link.entity';

export interface ShortLinkRepositoryProtocol {
  create(shortLink: Partial<ShortLink>): Promise<ShortLink>;
  findAll(userId: number): Promise<ShortLink[]>;
  findShortLinkById(id: number): Promise<ShortLink>;
  findShortLinkByUser(id: number, userId: number): Promise<ShortLink>;
  findOneByShortenedLink(shortLink: string): Promise<ShortLink>;
  updateByUser(
    id: number,
    userId: number,
    shortLink: Partial<ShortLink>,
  ): Promise<ShortLink>;
  updateCount(id: number, count: number): Promise<ShortLink>;
  remove(id: number, userId: number): Promise<void>;
}
