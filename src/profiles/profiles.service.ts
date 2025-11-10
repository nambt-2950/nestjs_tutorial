import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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

    const following = currentUser
      ? await this.isFollowing(currentUser, user)
      : false;

    const profileResponse = plainToInstance(
      ProfileResponseDto,
      {
        username: user.username,
        bio: user.bio,
        image: user.image,
        following,
      },
      { excludeExtraneousValues: true },
    );

    return { profile: profileResponse };
  }

  async followUser(username: string, currentUser: User) {
    const userToFollow = await this.usersService.findByUsername(username, ['followers']);

    if (!userToFollow) {
      const message = await this.i18n.t('profile.not_found');
      throw new NotFoundException(message);
    }

    if (userToFollow.id === currentUser.id) {
      const message = await this.i18n.t('profile.cannot_follow_self');
      throw new ForbiddenException(message);
    }

    const alreadyFollowing = userToFollow.followers?.some(
      (f) => f.id === currentUser.id,
    );

    if (!alreadyFollowing) {
      userToFollow.followers.push(currentUser);
      await this.usersService.save(userToFollow);
    }

    const profileResponse = plainToInstance(
      ProfileResponseDto,
      {
        username: userToFollow.username,
        bio: userToFollow.bio,
        image: userToFollow.image,
        following: true,
      },
      { excludeExtraneousValues: true },
    );

    return { profile: profileResponse };
  }

  async unfollowUser(username: string, currentUser: User) {
    const userToUnfollow = await this.usersService.findByUsername(username, ['followers']);

    if (!userToUnfollow) {
      const message = await this.i18n.t('profile.not_found');
      throw new NotFoundException(message);
    }

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (f) => f.id !== currentUser.id,
    );

    await this.usersService.save(userToUnfollow);

    const profileResponse = plainToInstance(
      ProfileResponseDto,
      {
        username: userToUnfollow.username,
        bio: userToUnfollow.bio,
        image: userToUnfollow.image,
        following: false,
      },
      { excludeExtraneousValues: true },
    );

    return { profile: profileResponse };
  }

  private async isFollowing(currentUser: User, targetUser: User): Promise<boolean> {
    const fullUser = await this.usersService.findById(currentUser.id, ['following']);
    if (!fullUser) {
      return false;
    }

    return fullUser.following?.some((f) => f.id === targetUser.id) ?? false;
  }
}