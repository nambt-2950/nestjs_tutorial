import {
  Entity,
  Column,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Article } from '../../articles/entities/article.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('comments')
export class Comment extends BaseEntity {
  @Column()
  body: string;

  @ManyToOne(() => User, (user: User) => user.comments, { eager: true })
  author: User;

  @ManyToOne(() => Article, (article: Article) => article.comments, { onDelete: 'CASCADE' })
  article: Article;
}