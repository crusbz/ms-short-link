import { ShortLink } from 'src/short-link/entities/short-link.entity';

export class ShortLinkDtoToDBMapper {
  targetLink: string;
  shortenedLink: string;
  password: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  constructor(shortLink: Partial<ShortLink>) {
    this.targetLink = shortLink.targetLink;
    this.shortenedLink = shortLink.shortenedLink;
    this.userId = shortLink?.userId || null;
    this.createdAt = shortLink.createdAt;
    this.updatedAt = shortLink.updatedAt;
    this.deletedAt = shortLink.deletedAt;
  }
}
