import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { IsEmailUniqueConstraint } from './validators/is-email-unique.validator';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, IsEmailUniqueConstraint],
  exports: [UsersService, IsEmailUniqueConstraint],
})
export class UsersModule {}