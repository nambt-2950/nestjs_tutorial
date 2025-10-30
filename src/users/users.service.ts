import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { USER_CONSTANTS } from '../common/constants/user.constant';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
}