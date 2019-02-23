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
    const method = req.method;
    const url = req.url;
    const before = Date.now();
    return call$.pipe(
      tap(() =>
        Logger.log(
          `${method} ${url} RTT: ${Date.now() - before}ms`,
          context.getClass().name +
            ' => ' +
            context.getHandler().name +
            ' => LoggingInterceptor',
        ),
      ),
    );
  }
}
