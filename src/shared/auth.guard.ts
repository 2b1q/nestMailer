import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    // check is Authorization header in client request from ExecutionContext
    if (!req.headers.authorization) {
      return false;
    }
    // validate JWT from Authorization header
    this.validateToken(req.headers.authorization, context);

    return true;
  }

  private validateRequest(req: any) {
    return Promise.resolve(true);
  }

  //  validate JWT helper
  private validateToken(auth: string, ctx: ExecutionContext) {
    Logger.warn(
      `Got Authorization header from client: ${auth}`,
      ctx.getClass().name + ' => AuthGuard',
    );
    // check Bearer word
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }
    // check JWT token
    const token = auth.split(' ')[1];
    // check token in async style
    jwt.verify(token, process.env.JWTSECRET, (err, data) => {
      if (err) {
        throw new HttpException(
          `Token validation failed: ${err.message || err.name}`,
          HttpStatus.FORBIDDEN,
        );
      }
      Logger.warn(
        `Authorization success: ${JSON.stringify(data)}`,
        ctx.getClass().name + ' => AuthGuard',
      );
    });
  }
}
