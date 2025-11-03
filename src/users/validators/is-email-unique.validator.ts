import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@ValidatorConstraint({ name: 'IsEmailUnique', async: true })
@Injectable()
export class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validate(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return !user;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Email "$value" already registered';
  }
}