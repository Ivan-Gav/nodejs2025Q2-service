import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TimestampInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.transform(data)));
  }

  private transform(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.transform(item));
    }

    if (typeof data === 'object' && !(data instanceof Date)) {
      return Object.entries(data).reduce((acc, [key, value]) => {
        // Transform both createdAt and updatedAt
        if ((key === 'createdAt' || key === 'updatedAt') && value) {
          return {
            ...acc,
            [key]: this.convertToTimestamp(value),
          };
        }

        // Recursively transform nested objects
        return {
          ...acc,
          [key]: this.transform(value),
        };
      }, {});
    }

    return data;
  }

  private convertToTimestamp(value: any): number | null {
    try {
      if (typeof value === 'string') {
        return new Date(value).getTime();
      }
      if (value instanceof Date) {
        return value.getTime();
      }
      if (typeof value === 'number') {
        return value;
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}
