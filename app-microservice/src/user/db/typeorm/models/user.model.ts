import { ShortLinkModel } from 'src/short-link/db/typeorm/models/short-link.model';
import { ShortLink } from 'src/short-link/entities/short-link.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserModel {
  @PrimaryGeneratedColumn() id: number;

  @Column() name: string;

  @Column() email: string;

  @OneToMany(() => ShortLinkModel, (shortLink) => shortLink.user)
  shortenedLinks: ShortLink[];

  @Column() password: string;

  @Column() createdAt: Date;

  @Column() updatedAt: Date;

  @DeleteDateColumn() deletedAt: Date;
}
