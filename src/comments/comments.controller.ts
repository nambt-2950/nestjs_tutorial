import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('comments')
@Controller('api/articles/:slug/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async addComment(
    @Param('slug') slug: string,
    @Body('comment') dto: CreateCommentDto,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.addComment(slug, dto, user);
  }

  @Get()
  async getComments(
    @Param('slug') slug: string,
    @CurrentUser() user?: User,
  ) {
    return this.commentsService.getComments(slug, user);
  }


  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteComment(
    @Param('slug') slug: string,
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.deleteComment(slug, id, user);
  }
}