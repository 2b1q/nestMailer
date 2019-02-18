import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): any {
    const context = host.switchToHttp();
    const req = context.getRequest();
    const resp = context.getResponse();
    const status = exception.getStatus();

    const errorObject = {
      code: status,
      timeStamp: new Date(),
      urlPath: req.url,
      method: req.method,
      message: exception.message.error || exception.message || null,
    };

    Logger.error(
      `${req.method} ${req.url}`,
      JSON.stringify(errorObject),
      'ExceptionFilter',
    );

    resp.status(status).json(errorObject);
  }
}
