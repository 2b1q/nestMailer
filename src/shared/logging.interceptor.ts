import {
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    call$: Observable<any>,
  ): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    const before = Date.now();
    Logger.log(
      `Handle ${method} ${url}`,
      `LoggingInterceptor => ${context.getClass().name} => ${
        context.getHandler().name
      }`,
    );
    return call$.pipe(
      tap(() =>
        Logger.log(
          `${method} ${url} RTT: ${Date.now() - before}ms`,
          `LoggingInterceptor => ${context.getClass().name} => ${
            context.getHandler().name
          }`,
        ),
      ),
    );
  }
}
