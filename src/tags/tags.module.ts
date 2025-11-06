import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsService } from './tags.service';
import { Tag } from './entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  providers: [TagsService],
  exports: [TagsService, TypeOrmModule],
})
export class TagsModule {}
