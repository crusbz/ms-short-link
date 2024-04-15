import { UserModel } from 'src/user/db/typeorm/models/user.model';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity({ name: 'short_links' })
export class ShortLinkModel {
  @PrimaryGeneratedColumn() id: number;

  @Column() targetLink: string;

  @ManyToOne(() => UserModel, (user) => user.shortenedLinks)
  user: UserModel; // Propriedade para armazenar o objeto LevelModel associado

  @Column({ type: 'int' })
  @RelationId((shortLink: ShortLinkModel) => shortLink.user)
  userId: number;

  @Column({ type: 'int', default: 0 }) count: number;

  @Column() shortenedLink: string;

  @Column() createdAt: Date;

  @Column() updatedAt: Date;

  @DeleteDateColumn() deletedAt: Date;
}
