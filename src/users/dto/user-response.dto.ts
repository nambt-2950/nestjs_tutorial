import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  email: string;

  @Expose()
  username: string;

  @Expose()
  bio?: string;

  @Expose()
  image?: string;

  @Expose()
  token: string;
}