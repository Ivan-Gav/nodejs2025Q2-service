import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RemovePasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map(this.removePassword);
        }
        return this.removePassword(data);
      }),
    );
  }

  private removePassword(data: any) {
    if (data && typeof data === 'object' && 'password' in data) {
      const result = { ...data };
      delete result.password;
      return result;
    }
    return data;
  }
}
