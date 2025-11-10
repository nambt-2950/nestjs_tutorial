import { IsArray, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateArticleDto {
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.title_string') })
  title?: string;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.description_string') })
  description?: string;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.body_string') })
  body?: string;

  @IsOptional()
  @IsArray({ message: i18nValidationMessage('validation.taglist_array') })
  tagList?: string[];
}