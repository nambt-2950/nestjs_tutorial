import {
  Column,
  Entity,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Tag  } from 'src/tags/entities/tag.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('articles')
export class Article extends BaseEntity {
  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ default: 0 })
  favoritesCount: number;

  @ManyToOne(() => User, (user) => user.articles, { eager: true })
  author: User;

  @ManyToMany(() => User, (user) => user.favorites)
  favoritedBy: User[];

  @ManyToMany(() => Tag, (tag) => tag.articles, { cascade: true })
  @JoinTable({
    name: 'article_tags',
    joinColumn: { name: 'articleId' },
    inverseJoinColumn: { name: 'tagId' },
  })
  tags: Tag[];

  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Comment[];
}