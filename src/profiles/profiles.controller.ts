import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { OptionalAuthGuard } from 'src/auth/guards/optional-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User as UserEntity } from 'src/users/entities/user.entity';

@Controller('api/profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @UseGuards(OptionalAuthGuard)
  @Get(':username')
  async getProfile(@Param('username') username: string, @CurrentUser() currentUser?: UserEntity) {
    return this.profilesService.getProfile(username, currentUser);
  }
}