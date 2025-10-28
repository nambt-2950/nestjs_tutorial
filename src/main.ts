import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get<number>('port') || 3000;

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
