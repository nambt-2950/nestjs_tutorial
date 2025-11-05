import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Validate,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { USER_CONSTANTS } from 'src/common/constants/user.constant';
import { IsEmailUniqueConstraint } from 'src/users/validators/is-email-unique.validator';

export class CreateUserDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.username_required') })
  @IsString({ message: i18nValidationMessage('validation.username_string') })
  @MinLength(USER_CONSTANTS.USERNAME_MIN_LENGTH, {
    message: i18nValidationMessage('validation.username_too_short'),
  })
  @MaxLength(USER_CONSTANTS.USERNAME_MAX_LENGTH, {
    message: i18nValidationMessage('validation.username_too_long'),
  })
  username: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.email_required') })
  @IsEmail({}, { message: i18nValidationMessage('validation.email_invalid') })
  @MaxLength(USER_CONSTANTS.EMAIL_MAX_LENGTH, {
    message: i18nValidationMessage('validation.email_too_long'),
  })
  @Validate(IsEmailUniqueConstraint, {
    message: i18nValidationMessage('validation.email_already_exists'),
  })
  email: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.password_required') })
  @MinLength(USER_CONSTANTS.PASSWORD_MIN_LENGTH, {
    message: i18nValidationMessage('validation.password_too_short'),
  })
  password: string;
}