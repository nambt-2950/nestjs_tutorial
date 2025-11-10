import { IsArray, IsNotEmpty, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { ARTICLE_CONSTANTS } from '../articles.constants';

export class CreateArticleDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.title_required') })
  @IsString({ message: i18nValidationMessage('validation.title_string') })
  @MinLength(ARTICLE_CONSTANTS.TITLE_MIN_LENGTH, {
    message: i18nValidationMessage('validation.title_too_short'),
  })
  @MaxLength(ARTICLE_CONSTANTS.TITLE_MAX_LENGTH, {
    message: i18nValidationMessage('validation.title_too_long'),
  })
  title: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.description_required') })
  @IsString({ message: i18nValidationMessage('validation.description_string') })
  @MinLength(ARTICLE_CONSTANTS.DESCRIPTION_MIN_LENGTH, {
    message: i18nValidationMessage('validation.title_too_short'),
  })
  @MaxLength(ARTICLE_CONSTANTS.DESCRIPTION_MAX_LENGTH, {
    message: i18nValidationMessage('validation.title_too_long'),
  })
  description: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.body_required') })
  @IsString({ message: i18nValidationMessage('validation.body_string') })
  body: string;

  @IsOptional()
  @IsArray({ message: i18nValidationMessage('validation.taglist_array') })
  tagList?: string[];
}