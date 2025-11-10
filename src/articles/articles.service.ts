import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { User } from 'src/users/entities/user.entity';
import { ARTICLE_CONSTANTS } from './articles.constants';
import slugify from 'slugify';
import { TagsService } from '../tags/tags.service';
import { QueryArticlesDto } from './dto/query-articles.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly i18n: I18nService,
    private readonly tagsService: TagsService,
  ) {}

  private generateSlug(title: string): string {
    return slugify(title, { lower: ARTICLE_CONSTANTS.SLUG_LOWERCASE }) +
      '-' +
      Math.random().toString(36).substring(ARTICLE_CONSTANTS.SLUG_RANDOM_START, ARTICLE_CONSTANTS.SLUG_RANDOM_END
    );
  }

  async createArticle(createArticleDto: CreateArticleDto, author: User): Promise<Article> {
    const article = this.articleRepository.create({
      ...createArticleDto,
      slug: this.generateSlug(createArticleDto.title),
      author,
    });

    if (createArticleDto.tagList?.length) {
      article.tags = await this.tagsService.findOrCreateTags(createArticleDto.tagList);
    }

    return this.articleRepository.save(article);
  }

  async findAll(query: QueryArticlesDto): Promise<[Article[], number]> {
    const { tags, author, limit = ARTICLE_CONSTANTS.DEFAULT_LIMIT, offset = ARTICLE_CONSTANTS.DEFAULT_OFFSET } = query;

    const qb = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.tags', 'tag')
      .orderBy('article.createdAt', 'DESC')
      .skip(+offset)
      .take(+limit);

    if (author) {
      qb.andWhere('author.username = :author', { author });
    }

    if (tags && tags.length > 0) {
      qb.andWhere('tag.name IN (:...tags)', { tags });
    }

    const [articles, count] = await qb.getManyAndCount();
    return [articles, count];
  }

  async findBySlug(slug: string, relations: string[] = []): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations,
    });

    if (!article) {
      throw new NotFoundException(
        await this.i18n.t('articles.article_not_found'),
      );
    }
    return article;
  }

  async updateArticle(slug: string, dto: UpdateArticleDto, currentUser: User) {
    const article = await this.findBySlug(slug);

    if (article.author.id !== currentUser.id) {
      throw new ForbiddenException(
        await this.i18n.t('articles.forbidden_edit_article'),
      );
    }

    Object.assign(article, dto);

    if (dto.title) {
      article.slug = this.generateSlug(dto.title);
    }

    return this.articleRepository.save(article);
  }

  async deleteArticle(slug: string, currentUser: User): Promise<void> {
    const article = await this.findBySlug(slug);

    if (article.author.id !== currentUser.id) {
      throw new ForbiddenException(
        await this.i18n.t('articles.forbidden_delete_article'),
      );
    }

    await this.articleRepository.remove(article);
  }

  public buildAuthorResponse(user: User, currentUser?: User) {
    return {
      username: user.username,
      bio: user.bio,
      image: user.image,
      following: currentUser ? currentUser.following?.some(f => f.id === user.id) : false,
    };
  }

  public buildArticleResponse(article: Article, currentUser?: User) {
    return {
      slug: article.slug,
      title: article.title,
      description: article.description,
      body: article.body,
      tagList: article.tags?.map(tag => tag.name) ?? [],
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      favorited: currentUser?.favorites?.some(f => f.id === article.id) ?? false,
      favoritesCount: article.favoritesCount,
      author: this.buildAuthorResponse(article.author, currentUser),
    };
  }

  public buildArticlesResponse(
    articles: Article[],
    currentUser?: User,
  ) {
    return {
      articles: articles.map(a => this.buildArticleResponse(a, currentUser)),
      articlesCount: articles.length,
    };
  }
}