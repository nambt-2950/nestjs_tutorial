import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { COMMENT_CONSTANTS } from '../comment.constants';

export class CreateCommentDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.comment_required') })
  @IsString({ message: i18nValidationMessage('validation.comment_string') })
  @MinLength(COMMENT_CONSTANTS.BODY_MIN_LENGTH, {
    message: i18nValidationMessage('validation.comment_too_short'),
  })
  @MaxLength(COMMENT_CONSTANTS.BODY_MAX_LENGTH, {
    message: i18nValidationMessage('validation.comment_too_long'),
  })
  body: string;
}
