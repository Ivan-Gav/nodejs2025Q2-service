import { Injectable, Scope } from '@nestjs/common';
import {
  createWriteStream,
  promises as fsPromises,
  WriteStream,
} from 'node:fs';
import { finished } from 'node:stream/promises';
import { join } from 'node:path';
import { format } from 'node:util';
import { LogLevel } from './log-level.enum';
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
    this.initialize().catch((error) => {
      console.error('Failed to initialize LoggingService:', error);
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
    const stream = createWriteStream(filePath, { flags: 'a' });
    stream.setMaxListeners(20);
    stream.on('error', (err) => {
      console.error('Log stream error:', err);
    });
    return stream;
  }

  private setupRotationChecks() {
    this.rotationCheckInterval = setInterval(
      async () => {
        try {
          await this.checkLogRotation();
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
      stream.removeAllListeners().end();
      await finished(stream);

      const timestamp = getFormattedDateTimeStr().replace(', ', '-');
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

    this.writeToStream(this.appLogStream, logMessage);
    if (level <= LogLevel.ERROR) {
      this.writeToStream(this.errorLogStream, logMessage);
    }
    this.writeColoredConsole(level, logMessage);
  }

  private writeColoredConsole(level: LogLevel, message: string) {
    const colors = {
      [LogLevel.ERROR]: '\x1b[31m', // Red
      [LogLevel.WARN]: '\x1b[33m', // Yellow
      [LogLevel.LOG]: '\x1b[32m', // Green
      [LogLevel.DEBUG]: '\x1b[36m', // Cyan
      [LogLevel.VERBOSE]: '\x1b[37m', // White
    };
    const reset = '\x1b[0m';

    process.stdout.write(`${colors[level]}${message}${reset}\n`);
  }

  private async writeToStream(stream: WriteStream, message: string) {
    if (!stream?.writable) return;

    try {
      await new Promise<void>((resolve, reject) => {
        const cleanup = () => {
          stream.removeListener('error', reject);
          stream.removeListener('drain', resolve);
        };

        stream.once('error', reject);
        stream.once('drain', resolve);

        if (stream.write(message + '\n')) {
          cleanup();
          resolve();
        }
      });
    } catch (error) {
      console.error('Log write failed:', error.message);
      console.log(message); // Fallback to console
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

    try {
      await this.endStream(this.appLogStream);
      await this.endStream(this.errorLogStream);
    } catch {}
  }

  private async endStream(stream?: WriteStream) {
    if (!stream || stream.destroyed) return;

    stream.end();
    await finished(stream);
  }

  isLevelEnabled(level: LogLevel): boolean {
    return level >= this.currentLogLevel;
  }
}
