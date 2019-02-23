import {
  Injectable,
  NestMiddleware,
  MiddlewareFunction,
  Logger,
} from '@nestjs/common';

@Injectable()
export class CustomMiddleware implements NestMiddleware {
  resolve(...args: any[]): MiddlewareFunction {
    return (req, res, next) => {
      const ua = () =>
        req.headers['user-agent'] ? req.headers['user-agent'] : '';
      // handle request
      Logger.warn(
        `
      Handle incoming request from ${req.ip}
      Url: ${req.originalUrl}
      User-Agent: ${JSON.stringify(ua())}`,
        'CustomMiddleware',
      );
      // setup custom response header
      res.set('x-powered-by', 'Nest.JS');
      next();
    };
  }
}
