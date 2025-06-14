import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { LoggingService } from '../logging/logging.service';
import { Request, Response } from 'express';
import { getFormattedDateTimeStr } from 'src/common/utils/format.utils';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  private readonly logger = new LoggingService().setContext('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorMessage =
      typeof message === 'string' ? message : message['message'];
    const error = exception instanceof Error ? exception : undefined;

    this.logger.error(errorMessage, error);

    if (!(exception instanceof HttpException)) {
      response.status(status).json({
        statusCode: status,
        message: 'Internal server error',
        timestamp: getFormattedDateTimeStr(),
        path: request.url,
      });
      return;
    }

    response.status(status).json({
      statusCode: status,
      message: errorMessage,
      timestamp: getFormattedDateTimeStr(),
      path: request.url,
    });
  }
}
