import { ShortLink } from 'src/short-link/entities/short-link.entity';
import { User } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { OutputShortLinkDto } from '../../short-link/dto/output-short-link.dto';

export class OutputUserDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty({ type: [OutputShortLinkDto] })
  shortenedLinks?: ShortLink[];
  @ApiProperty()
  password: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  deletedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.shortenedLinks = user.shortenedLinks;
    this.password = user.password;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.deletedAt = user.deletedAt;
  }
}

export class OutputListUserDto {
  users: OutputUserDto[];

  constructor(users: User[]) {
    this.users = users.map((user: User) => new OutputUserDto(user));
  }
}
