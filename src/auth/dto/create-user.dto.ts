import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Validate,
} from 'class-validator';
import { USER_CONSTANTS } from 'src/common/constants/user.constant';
import { IsEmailUniqueConstraint } from 'src/users/validators/is-email-unique.validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(USER_CONSTANTS.USERNAME_MIN_LENGTH)
  @MaxLength(USER_CONSTANTS.USERNAME_MAX_LENGTH)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(USER_CONSTANTS.EMAIL_MAX_LENGTH)
  @Validate(IsEmailUniqueConstraint)
  email: string;

  @IsNotEmpty()
  @MinLength(USER_CONSTANTS.PASSWORD_MIN_LENGTH)
  password: string;
}