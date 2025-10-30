import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('api/users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  register(@Body('user') createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  login(@Body('user') loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}
