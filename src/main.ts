import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpStatus, VersioningType } from '@nestjs/common';
import { I18nValidationPipe, I18nValidationExceptionFilter } from 'nestjs-i18n';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get<number>('port') || 3000;

  // Configure global validation
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new I18nValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
      stopAtFirstError: false,
      dismissDefaultMessages: false,
    }),
  );

  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      responseBodyFormatter: (_host, _exception, formattedErrors) => ({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Bad Request',
        errors: formattedErrors,
      }),
    }),
  );

  // Configure API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Configure Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS Tutorial API')
    .setDescription('API documentation for NestJS Tutorial project')
    .setVersion('1.0')
    .addBearerAuth() // Optional: support Authorization header
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port, '0.0.0.0');
}
bootstrap();
