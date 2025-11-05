import { Expose } from 'class-transformer';

export class ProfileResponseDto {
  @Expose()
  username: string;

  @Expose()
  bio?: string;

  @Expose()
  image?: string;

  @Expose()
  following: boolean;
}