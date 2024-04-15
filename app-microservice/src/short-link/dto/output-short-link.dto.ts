import { ApiProperty } from '@nestjs/swagger';
import { ShortLink } from '../entities/short-link.entity';

export class OutputShortLinkDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  targetLink: string;
  @ApiProperty()
  shortenedLink: string;
  @ApiProperty()
  userId: number;
  @ApiProperty()
  count: number;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  deletedAt: Date;

  constructor(shortLink: ShortLink) {
    this.id = shortLink.id;
    this.targetLink = shortLink.targetLink;
    this.shortenedLink = shortLink.shortenedLink;
    this.userId = shortLink.userId;
    this.count = shortLink.count;
    this.createdAt = shortLink.createdAt;
    this.updatedAt = shortLink.updatedAt;
    this.deletedAt = shortLink.deletedAt;
  }
}

export class OutputListShortLinkDto {
  @ApiProperty({ type: [OutputShortLinkDto] })
  shortenedLinks: OutputShortLinkDto[];

  constructor(users: ShortLink[]) {
    this.shortenedLinks = users.map(
      (shortLink: ShortLink) => new OutputShortLinkDto(shortLink),
    );
  }
}
