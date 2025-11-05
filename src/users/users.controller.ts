import { Controller, Get, UseGuards, Put, Body } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User as UserEntity } from './entities/user.entity';

@Controller('api/user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCurrentUser(@CurrentUser() user: UserEntity) {
    return this.usersService.buildUserResponse(user);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateUser(@CurrentUser() user: UserEntity, @Body('user') updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.updateUser(user.id, updateUserDto);
    return this.usersService.buildUserResponse(updatedUser);
  }
}