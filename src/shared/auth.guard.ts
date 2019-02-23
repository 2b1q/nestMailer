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
    // write decoded JWT to Express req object => user property
    req.user = await this.validateToken(req.headers.authorization, context);
    return true;
  }

  //  validate JWT helper
  private async validateToken(auth: string, ctx: ExecutionContext) {
    Logger.warn(
      `Got Authorization header from client: ${auth}`,
      ctx.getClass().name + ' => ' + ctx.getHandler().name + ' => AuthGuard',
    );

    // check Bearer word
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }
    // check JWT token
    const token = auth.split(' ')[1];
    /*
    // check token in sync style
    try {
      const decoded = await jwt.verify(token, process.env.JWTSECRET);
      Logger.warn(
        `Authorization success: ${JSON.stringify(decoded)}`,
        ctx.getClass().name + ' => AuthGuard',
      );
      return decoded;
    } catch (err) {
      throw new HttpException(
        `Token validation failed: ${err.message || err.name}`,
        HttpStatus.FORBIDDEN,
      );
    }
    */

    // check token in async (callback style)
    return jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
      if (err) {
        throw new HttpException(
          `Token validation failed: ${err.message || err.name}`,
          HttpStatus.FORBIDDEN,
        );
      }
      Logger.warn(
        `Authorization success: ${JSON.stringify(decoded)}`,
        ctx.getClass().name + ' => ' + ctx.getHandler().name + ' => AuthGuard',
      );
      return decoded;
    });
  }
}
