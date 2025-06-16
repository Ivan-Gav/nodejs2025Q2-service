import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import AppDataSource from './data-source';
import { LoggingService } from './logging/logging.service';
import { ExceptionsFilter } from './filters/exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = await app.resolve(LoggingService);

  app.useGlobalFilters(new ExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection at: ${promise}`, reason as Error);
  });

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  console.log('DB connected:', AppDataSource.isInitialized);

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
