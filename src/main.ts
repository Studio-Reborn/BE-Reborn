import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  app.use(cookieParser());

  // swagger
  SwaggerModule.setup(
    'api-docs',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Reborn API Documentation')
        .setDescription('Reborn의 API 문서입니다.')
        .setVersion('1.0.0')
        .build(),
    ),
  );

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
