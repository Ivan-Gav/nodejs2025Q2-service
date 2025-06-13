// import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
// import { createWriteStream, promises as fsPromises, WriteStream } from 'fs';
// import { pipeline } from 'stream/promises';
// import { Readable } from 'stream';
// import { join } from 'path';

// @Injectable({ scope: Scope.TRANSIENT })
// export class LoggingService extends ConsoleLogger {
//   private appLogStream: WriteStream;
//   private errorLogStream: WriteStream;
//   private logsDir = 'logs';
//   private appLogFile = 'app.log';
//   private errorLogFile = 'error.log';
//   private maxFileSize: number;
//   private rotationCheckInterval: NodeJS.Timeout;

//   constructor(context?: string) {
//     super(context, {
//       // @ts-expect-error the option oficially exists in Nestjs. I just didn't want to fix the declaration file
//       prefix: process.env.LOG_PREFIX || 'MyApp',
//       // timestamp: true,
//     });
//     this.maxFileSize = process.env.LOG_MAX_FILE_SIZE
//       ? parseInt(process.env.LOG_MAX_FILE_SIZE)
//       : 10 * 1024;
//     this.initialize().catch((err) => {
//       super.error('Failed to initialize logger', err.stack);
//     });
//   }

//   private async initialize() {
//     try {
//       await fsPromises.mkdir(this.logsDir, { recursive: true });
//       this.appLogStream = this.createLogStream(this.appLogFile);
//       this.errorLogStream = this.createLogStream(this.errorLogFile);
//       this.setupRotationChecks();
//     } catch (err) {
//       super.error('Logger initialization failed', err.stack);
//     }
//   }

//   private createLogStream(filename: string): WriteStream {
//     return createWriteStream(join(this.logsDir, filename), { flags: 'a' });
//   }

//   private setupRotationChecks() {
//     this.rotationCheckInterval = setInterval(
//       () =>
//         this.checkLogRotation().catch((err) => {
//           super.error('Log rotation check failed', err.stack);
//         }),
//       60000, // Check every minute
//     );
//   }

//   private async checkLogRotation() {
//     await Promise.all([
//       this.checkFileRotation(this.appLogFile, this.appLogStream),
//       this.checkFileRotation(this.errorLogFile, this.errorLogStream),
//     ]);
//   }

//   private async checkFileRotation(filename: string, stream: WriteStream) {
//     try {
//       const filePath = join(this.logsDir, filename);
//       const stats = await fsPromises.stat(filePath).catch(() => null);

//       if (stats && stats.size > this.maxFileSize) {
//         await this.rotateLogFile(filename, stream);
//       }
//     } catch (err) {
//       super.error(`Failed to check rotation for ${filename}`, err.stack);
//     }
//   }

//   private async rotateLogFile(filename: string, stream: WriteStream) {
//     try {
//       // Close current stream
//       await new Promise<void>((resolve, reject) => {
//         stream.end(() => resolve());
//         stream.on('error', reject);
//       });

//       // Generate timestamp for rotated file
//       const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
//       const rotatedFilename = `${filename}.${timestamp}`;

//       // Rename current log file
//       await fsPromises.rename(
//         join(this.logsDir, filename),
//         join(this.logsDir, rotatedFilename),
//       );

//       // Create new stream
//       if (filename === this.appLogFile) {
//         this.appLogStream = this.createLogStream(this.appLogFile);
//       } else {
//         this.errorLogStream = this.createLogStream(this.errorLogFile);
//       }
//     } catch (err) {
//       super.error(`Failed to rotate log file ${filename}`, err.stack);
//     }
//   }

//   log(message: string) {
//     super.log(message);
//     this.writeToFile('log', message);
//   }

//   error(message: string, trace?: string) {
//     super.error(message, trace);
//     this.writeToFile('error', `${message}${trace ? '\n' + trace : ''}`);
//   }

//   warn(message: string) {
//     super.warn(message);
//     this.writeToFile('warn', message);
//   }

//   debug(message: string) {
//     super.debug(message);
//     this.writeToFile('debug', message);
//   }

//   verbose(message: string) {
//     super.verbose(message);
//     this.writeToFile('verbose', message);
//   }

//   private async writeToFile(level: string, message: string) {
//     const timestamp = new Date().toISOString();
//     const formatted = `${timestamp} [${this.context || 'App'}] ${level.toUpperCase()} ${message}\n`;

//     try {
//       await pipeline(
//         Readable.from([formatted]),
//         level === 'error' ? this.errorLogStream : this.appLogStream,
//       );
//     } catch (err) {
//       super.error('Failed to write log to file', err.stack);
//     }
//   }

//   async onApplicationShutdown() {
//     clearInterval(this.rotationCheckInterval);
//     await Promise.all([
//       new Promise((resolve) => this.appLogStream.end(resolve)),
//       new Promise((resolve) => this.errorLogStream.end(resolve)),
//     ]);
//   }
// }

import { Injectable, Scope } from '@nestjs/common';
import {
  createWriteStream,
  promises as fsPromises,
  WriteStream,
} from 'node:fs';
import { finished, pipeline } from 'node:stream/promises';
import { join } from 'node:path';
import { format } from 'node:util';
import { LogLevel } from './log-level.enum';
import { Readable } from 'node:stream';
import { getFormattedDateTimeStr } from 'src/common/utils/format.utils';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggingService {
  private appLogStream: WriteStream;
  private errorLogStream: WriteStream;
  private currentLogLevel: LogLevel;
  private maxFileSize: number;
  private logsDir = process.env.LOGS_DIR_NAME || 'logs';
  private appLogFile = process.env.LOGS_APP_NAME || 'app.log';
  private errorLogFile = process.env.LOGS_ERR_NAME || 'error.log';
  private rotationCheckInterval: NodeJS.Timeout;
  private prefix = process.env.LOGS_DIR_PREFIX || 'App';
  private context = 'DefaultLogger';

  constructor() {
    this.initialize().catch((err) => {
      console.error('Failed to initialize LoggingService:', err);
    });
  }

  setContext(context: string) {
    this.context = context;
    return this;
  }

  private async initialize() {
    this.currentLogLevel = process.env.LOG_LEVEL
      ? parseInt(process.env.LOG_LEVEL)
      : LogLevel.DEBUG;

    this.maxFileSize = process.env.LOG_MAX_FILE_SIZE
      ? parseInt(process.env.LOG_MAX_FILE_SIZE) * 1024
      : 10 * 1024;

    try {
      await fsPromises.mkdir(this.logsDir, { recursive: true });
    } catch (error) {
      console.error('Could not create logs directory');
      throw error;
    }

    this.appLogStream = this.createLogStream(this.appLogFile);
    this.errorLogStream = this.createLogStream(this.errorLogFile);

    this.setupRotationChecks();
  }

  private createLogStream(filename: string): WriteStream {
    const filePath = join(this.logsDir, filename);
    return createWriteStream(filePath, { flags: 'a' });
  }

  private setupRotationChecks() {
    this.rotationCheckInterval = setInterval(
      async () => {
        try {
          this.checkLogRotation();
        } catch (error) {
          console.error('Log rotation check failed');
          throw error;
        }
      },
      60000, // Check every minute
    );
  }

  private async checkLogRotation() {
    await Promise.all([
      this.checkFileRotation(this.appLogFile, this.appLogStream),
      this.checkFileRotation(this.errorLogFile, this.errorLogStream),
    ]);
  }

  private async checkFileRotation(filename: string, stream: WriteStream) {
    try {
      const filePath = join(this.logsDir, filename);

      const stats = await fsPromises.stat(filePath);

      if (stats && stats.size > this.maxFileSize) {
        await this.rotateLogFile(filename, stream);
      }
    } catch (error) {
      console.error(`Failed to check rotation for ${filename}`);
      throw error;
    }
  }

  private async rotateLogFile(filename: string, stream: WriteStream) {
    try {
      // Close current stream
      await finished(stream.end());

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const rotatedFilename = `${filename}.${timestamp}`;

      await fsPromises.rename(
        join(this.logsDir, filename),
        join(this.logsDir, rotatedFilename),
      );

      if (filename === this.appLogFile) {
        this.appLogStream = this.createLogStream(this.appLogFile);
      } else {
        this.errorLogStream = this.createLogStream(this.errorLogFile);
      }
    } catch (error) {
      console.error(`Failed to rotate log file ${filename}`);
      throw error;
    }
  }

  private writeLog(level: LogLevel, message: string, error?: Error) {
    if (level > this.currentLogLevel) return;

    // const timestamp = new Date().toISOString();
    const timestamp = getFormattedDateTimeStr();
    const logLevelName = LogLevel[level];
    const logMessage = error
      ? format(
          '[%s] - %s   %s  [%s] %s  %s',
          this.prefix,
          timestamp,
          logLevelName,
          this.context,
          message,
          error.stack,
        )
      : format(
          '[%s] - %s  %s  [%s]  %s',
          this.prefix,
          timestamp,
          logLevelName,
          this.context,
          message,
        );

    // Write to appropriate streams
    this.writeToStream(this.appLogStream, logMessage);
    if (level >= LogLevel.ERROR) {
      this.writeToStream(this.errorLogStream, logMessage);
    }
    process.stdout.write(`${logMessage}\n`);
  }

  private async writeToStream(stream: WriteStream, message: string) {
    const readable = Readable.from([message + '\n']);

    try {
      await pipeline(readable, stream);
    } catch (error) {
      console.error('Log write failed');
      // Fallback to console if file writing fails
      console.log(message);
      throw error;
    }
  }

  error(message: string, error?: Error) {
    this.writeLog(LogLevel.ERROR, message, error);
  }

  warn(message: string) {
    this.writeLog(LogLevel.WARN, message);
  }

  log(message: string) {
    this.writeLog(LogLevel.LOG, message);
  }

  debug(message: string) {
    this.writeLog(LogLevel.DEBUG, message);
  }

  verbose(message: string) {
    this.writeLog(LogLevel.VERBOSE, message);
  }

  async onApplicationShutdown() {
    clearInterval(this.rotationCheckInterval);
    await finished(this.appLogStream.end());
    await finished(this.errorLogStream.end());
  }
}
