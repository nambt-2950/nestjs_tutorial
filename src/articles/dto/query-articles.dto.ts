import { Type, Transform } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { ARTICLE_CONSTANTS } from '../articles.constants';

export class QueryArticlesDto {
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',').map((t: string) => t.trim()) : []
  )
  tags?: string[];

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.author_string') })
  author?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: i18nValidationMessage('validation.limit_integer') })
  @IsPositive({ message: i18nValidationMessage('validation.limit_positive') })
  limit?: number = ARTICLE_CONSTANTS.DEFAULT_LIMIT;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: i18nValidationMessage('validation.offset_integer') })
  @Min(ARTICLE_CONSTANTS.OFFSET_MIN, {
    message: i18nValidationMessage('validation.offset_min'),
  })
  offset?: number = ARTICLE_CONSTANTS.DEFAULT_OFFSET;
}