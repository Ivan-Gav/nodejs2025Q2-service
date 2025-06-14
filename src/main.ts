import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import AppDataSource from './data-source';
import { LoggingService } from './logging/logging.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.resolve(LoggingService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  console.log('DB connected:', AppDataSource.isInitialized);

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
