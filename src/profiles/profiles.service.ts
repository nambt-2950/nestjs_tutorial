import { Injectable, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { plainToInstance } from 'class-transformer';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { ProfileResponseDto } from './dto/profile-response.dto';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly usersService: UsersService,
    private readonly i18n: I18nService,
  ) {}

  async getProfile(username: string, currentUser?: User) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      const message = await this.i18n.t('profile.not_found');
      throw new NotFoundException(message);
    }

    const profileResponse = plainToInstance(
      ProfileResponseDto,
      {
        username: user.username,
        bio: user.bio,
        image: user.image,
        following: false,
      },
      { excludeExtraneousValues: true },
    );

    return { profile: profileResponse };
  }
}