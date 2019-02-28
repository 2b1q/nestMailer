import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailModule } from './mail/mail.module';
import { HttpErrorFilter } from './shared/http-error.filter';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { UserModule } from './user/user.module';
import { CustomMiddleware } from './shared/custom.middleware.service';
import { HttpRpcController } from './rpc/httpRpcController';
import { RpcService } from './rpc/rpc.service';

@Module({
  imports: [MailModule, UserModule, TypeOrmModule.forRoot()],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter, // global http Exception Error handler filter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor, // global Logger interceptor
    },
    RpcService,
  ],
  controllers: [HttpRpcController],
})
//  Modules that include middleware have to implement the NestModule interface.
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // attach our custom 'CustomMiddleware' middleware to the module
    // for all routes pattern '*'
    consumer.apply(CustomMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
