import { Controller, Get, Param, Post, Delete, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User as UserEntity } from 'src/users/entities/user.entity';

@Controller('api/profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @UseGuards(OptionalAuthGuard)
  @Get(':username')
  async getProfile(
    @Param('username') username: string,
    @CurrentUser() currentUser?: UserEntity,
  ) {
    return this.profilesService.getProfile(username, currentUser);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':username/follow')
  async followUser(
    @Param('username') username: string,
    @CurrentUser() currentUser: UserEntity,
  ) {
    return this.profilesService.followUser(username, currentUser);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':username/follow')
  async unfollowUser(
    @Param('username') username: string,
    @CurrentUser() currentUser: UserEntity,
  ) {
    return this.profilesService.unfollowUser(username, currentUser);
  }
}