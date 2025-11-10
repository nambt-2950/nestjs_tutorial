import { Module } from '@nestjs/common';
import { I18nModule, I18nJsonLoader, HeaderResolver } from 'nestjs-i18n';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import databaseConfig from './config/database.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ArticlesModule } from './articles/articles.module';
import { TagsModule } from './tags/tags.module';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(process.cwd(), 'src/i18n/locales'),
        watch: true,
      },
      loader: I18nJsonLoader,
      resolvers: [
        { use: HeaderResolver, options: ['accept-language'] },
      ],
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProfilesModule,
    ArticlesModule,
    TagsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
