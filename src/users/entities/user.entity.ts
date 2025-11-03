import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { USER_CONSTANTS } from 'src/common/constants/user.constant';

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
}