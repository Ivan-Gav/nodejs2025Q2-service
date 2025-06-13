import { Module, OnApplicationShutdown } from '@nestjs/common';
import { LoggingService } from './logging.service';

@Module({
  providers: [LoggingService],
  exports: [LoggingService],
})
export class LoggingModule implements OnApplicationShutdown {
  constructor(private readonly loggingService: LoggingService) {}

  async onApplicationShutdown() {
    await this.loggingService.onApplicationShutdown();
  }
}
