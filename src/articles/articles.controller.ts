import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { OptionalAuthGuard } from 'src/auth/guards/optional-auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { QueryArticlesDto } from './dto/query-articles.dto';

@Controller('api/articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly i18n: I18nService,
  ) {}

  @UseGuards(OptionalAuthGuard)
  @Get()
  async findAll(@Query() query: QueryArticlesDto, @CurrentUser() currentUser?: User) {
    const [articles, count] = await this.articlesService.findAll(query);
    return this.articlesService.buildArticlesResponse(articles, currentUser);
  }

  @UseGuards(OptionalAuthGuard)
  @Get(':slug')
  async findOne(@Param('slug') slug: string, @CurrentUser() currentUser?: User) {
    const article = await this.articlesService.findBySlug(slug, ['author', 'tags']);
    return {
      article: this.articlesService.buildArticleResponse(article, currentUser),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @CurrentUser() user: User,
    @Body('article') dto: CreateArticleDto,
  ) {
    const article = await this.articlesService.createArticle(dto, user);
    return {
      article: this.articlesService.buildArticleResponse(article, user),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':slug')
  async update(
    @Param('slug') slug: string,
    @Body('article') dto: UpdateArticleDto,
    @CurrentUser() user: User,
  ) {
    const article = await this.articlesService.updateArticle(slug, dto, user);
    return {
      article: this.articlesService.buildArticleResponse(article, user),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':slug')
  async delete(
    @Param('slug') slug: string,
    @CurrentUser() user: User,
  ) {
    await this.articlesService.deleteArticle(slug, user);
    const message = await this.i18n.t('articles.deleted_success');
    return { message };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':slug/favorite')
  async favorite(
    @Param('slug') slug: string,
    @CurrentUser() user: User,
  ) {
    const article = await this.articlesService.favoriteArticle(slug, user);
    return this.articlesService.buildArticleResponse(article, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':slug/favorite')
  async unfavorite(
    @Param('slug') slug: string,
    @CurrentUser() user: User,
  ) {
    const article = await this.articlesService.unfavoriteArticle(slug, user);
    return this.articlesService.buildArticleResponse(article, user);
  }
}