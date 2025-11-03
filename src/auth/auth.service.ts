import { Injectable, UnauthorizedException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from '../users/entities/user.entity';
import { UserResponseDto } from '../users/dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    return this.buildUserResponse(user);
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersService.findByEmail(loginUserDto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = bcrypt.compare(loginUserDto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.buildUserResponse(user);
  }

  private buildUserResponse(user: User) {
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
