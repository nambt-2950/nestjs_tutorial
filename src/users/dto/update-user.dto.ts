import { IsEmail, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { USER_CONSTANTS } from 'src/users/user.constant';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: i18nValidationMessage('validation.email_invalid') })
  @MaxLength(USER_CONSTANTS.EMAIL_MAX_LENGTH, { message: i18nValidationMessage('validation.email_too_long') })
  email?: string;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.username_string') })
  @MinLength(USER_CONSTANTS.USERNAME_MIN_LENGTH, {
    message: i18nValidationMessage('validation.username_too_short', { args: { min: USER_CONSTANTS.USERNAME_MIN_LENGTH } }),
  })
  @MaxLength(USER_CONSTANTS.USERNAME_MAX_LENGTH, {
    message: i18nValidationMessage('validation.username_too_long', { args: { max: USER_CONSTANTS.USERNAME_MAX_LENGTH } }),
  })
  username?: string;

  @IsOptional()
  @MinLength(USER_CONSTANTS.PASSWORD_MIN_LENGTH, {
    message: i18nValidationMessage('validation.password_too_short', { args: { min: USER_CONSTANTS.PASSWORD_MIN_LENGTH } }),
  })
  password?: string;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.bio_string') })
  bio?: string;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.image_string') })
  image?: string;
}