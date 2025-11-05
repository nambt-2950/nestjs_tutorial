import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { IsEmailUniqueConstraint } from './validators/is-email-unique.validator';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, IsEmailUniqueConstraint],
  exports: [UsersService, IsEmailUniqueConstraint],
  controllers: [UsersController],
})
export class UsersModule {}