import {
  Column,
  Entity,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Tag  } from 'src/tags/entities/tag.entity';
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

  @ManyToMany(() => User, user => user.favorites)
  @JoinTable()
  favoritedBy: User[];

  @ManyToMany(() => Tag, (tag) => tag.articles, { cascade: true })
  @JoinTable({
    name: 'article_tags',
    joinColumn: { name: 'articleId' },
    inverseJoinColumn: { name: 'tagId' },
  })
  tags: Tag[];
}