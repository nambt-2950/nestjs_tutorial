import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { USER_CONSTANTS } from 'src/users/user.constant';
import { Article } from '../../articles/entities/article.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true, length: USER_CONSTANTS.EMAIL_MAX_LENGTH })
  email: string;

  @Column({ length: USER_CONSTANTS.USERNAME_MAX_LENGTH })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ default: false })
  demo: boolean;

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  @ManyToMany(() => User, (user) => user.followers)
  @JoinTable({
    name: 'user_following',
    joinColumn: { name: 'userId' },
    inverseJoinColumn: { name: 'followingId' },
  })
  following: User[];

  @ManyToMany(() => User, (user) => user.following)
  followers: User[];

  @ManyToMany(() => Article, (article) => article.favoritedBy)
  @JoinTable({
    name: 'user_favorites_article',
    joinColumn: { name: 'userId' },
    inverseJoinColumn: { name: 'articleId' },
  })
  favorites: Article[];
}