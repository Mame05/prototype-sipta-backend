import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const frontendUrl = process.env.FRONTEND_URL;

   app.enableCors({
    origin: frontendUrl
    ?['http://localhost:4200', frontendUrl]
    : 'http://localhost:4200',
  });

  // Permet d'afficher les images uploadées 
    app.use( 
      '/uploads', 
      express.static(join(process.cwd(), 'uploads')), 
    );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
