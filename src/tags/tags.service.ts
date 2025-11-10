import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async findOrCreateTags(tagNames: string[]): Promise<Tag[]> {
    const tags: Tag[] = [];
    for (const name of tagNames) {
      let tag = await this.tagRepository.findOne({ where: { name } });
      if (!tag) {
        tag = this.tagRepository.create({ name });
        await this.tagRepository.save(tag);
      }
      tags.push(tag);
    }
    return tags;
  }

  async findAll(): Promise<Tag[]> {
    return this.tagRepository.find();
  }
}
