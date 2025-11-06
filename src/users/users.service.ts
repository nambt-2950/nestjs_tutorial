import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { USER_CONSTANTS } from './user.constant';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly i18n: I18nService,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    const hashed = await bcrypt.hash(dto.password, USER_CONSTANTS.PASSWORD_SALT_ROUNDS);
    const user = this.userRepository.create({
      username: dto.username,
      email: dto.email,
      password: hashed,
    });

    return this.userRepository.save(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(
        await this.i18n.t('auth.user_not_found')
      );
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, USER_CONSTANTS.PASSWORD_SALT_ROUNDS);
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  buildUserResponse(user: User) {
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' },
    );

    const userResponse = {
      email: user.email,
      username: user.username,
      bio: user.bio,
      image: user.image,
      token,
    };

    return {
      user: plainToInstance(UserResponseDto, userResponse, {
        excludeExtraneousValues: true,
      }),
    };
  }
}