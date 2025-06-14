import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './logging.service';
import { LogLevel } from './log-level.enum';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger: LoggingService;

  constructor() {
    this.logger = new LoggingService();
  }

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, query, body } = req;

    if (this.logger.isLevelEnabled(LogLevel.DEBUG)) {
      this.logger.setContext('Request');
      this.logger.log(`${method} ${originalUrl}`);
      if (Object.keys(query).length) {
        this.logger.log(`-> Query: ${JSON.stringify(query)}`);
      }
      if (Object.keys(body).length) {
        this.logger.log(`-> Body: ${JSON.stringify(body)}`);
      }
    }

    const start = Date.now();
    const finishListener = () => {
      const duration = Date.now() - start;
      this.logger.setContext('Response');
      this.logger.log(
        `${method} ${originalUrl} - Status code: ${res.statusCode} (${duration}ms)`,
      );
      res.removeListener('finish', finishListener);
    };
    res.on('finish', finishListener);

    next();
  }
}
