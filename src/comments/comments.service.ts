import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';

import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../users/entities/user.entity';
import { ArticlesService } from '../articles/articles.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepo: Repository<Comment>,
    private readonly articlesService: ArticlesService,
    private readonly i18n: I18nService,
  ) {}

  async addComment(slug: string, dto: CreateCommentDto, author: User) {
    const article = await this.articlesService.findBySlug(slug);
    if (!article) {
      throw new NotFoundException(await this.i18n.t('comment.article_not_found'));
    }

    const comment = this.commentsRepo.create({
      body: dto.body,
      author,
      article,
    });

    await this.commentsRepo.save(comment);

    return { comment: this.buildCommentResponse(comment, author) };
  }

  async getComments(slug: string, currentUser?: User) {
    const article = await this.articlesService.findBySlug(slug, ['comments', 'comments.author']);
    if (!article) {
      throw new NotFoundException(await this.i18n.t('comment.article_not_found'));
    }

    const comments = article.comments.map((comment) =>
      this.buildCommentResponse(comment, currentUser),
    );

    return { comments };
  }

  async deleteComment(slug: string, id: number, currentUser: User) {
    const comment = await this.commentsRepo.findOne({
      where: { id },
      relations: ['author', 'article'],
    });

    if (!comment) {
      throw new NotFoundException(await this.i18n.t('comment.comment_not_found'));
    }

    if (comment.article.slug !== slug) {
      throw new NotFoundException(await this.i18n.t('comment.comment_not_found'));
    }

    if (comment.author.id !== currentUser.id) {
      throw new ForbiddenException(
        await this.i18n.t('comment.forbidden_delete_comment'),
      );
    }

    await this.commentsRepo.remove(comment);

    return { message: await this.i18n.t('comment.comment_deleted_successfully') };
  }

  private buildCommentResponse(comment: Comment, currentUser?: User) {
    const { author, ...rest } = comment;
    return {
      ...rest,
      author: {
        username: author.username,
        bio: author.bio,
        image: author.image,
        following: false,
      },
    };
  }
}