import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    // debug metadata {type: 'body' | 'query' | 'param' | 'custom';}  & value (of body|query|param)
    Logger.log(`metadata:\n ${JSON.stringify(metadata)}`, 'ValidationPipe');
    Logger.log(`value:\n ${JSON.stringify(value)}`, 'ValidationPipe');

    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // FIRST validation -> isEmpty body
    // if user put/post an empty partial<mail> object
    if (value instanceof Object && this.isEmpty(value)) {
      throw new HttpException(
        'Validation failed: No body submitted',
        HttpStatus.BAD_REQUEST,
      );
    }

    // SECOND validation (CLASS validator => is type of properties values the same is in the mailDTO decorators)
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      // throw new BadRequestException('Validation failed');
      // "message": "Validation failed:
      // [{\"target\":
      // {\"title\":123,\"to\":\"qwd@de.de\",\"from\":\"b-b-q@ya.ru\",\"message\":\"123123123 44444\",\"any\":\"any\"},
      // \"value\":123,\"property\":\"title\",\"children\":[],\"constraints\":{\"isString\":\"title must be a string\"}}]"
      throw new HttpException(
        `Validation failed: ${JSON.stringify(this.parseErrors(errors))}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // 3rd validation "to" AND "from" => must be email pattern
    if (!this.validateEmail(value.to) || !this.validateEmail(value.from)) {
      throw new HttpException(
        `Email validation failed: ${JSON.stringify(value)}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find(type => metatype === type);
  }

  // validate if HTTP Body not Empty
  private isEmpty(value: any): boolean {
    return Object.keys(value).length <= 0;
  }

  // Parse validation constraints (get constraints values)
  private parseErrors(errors: any[]) {
    return errors.map(
      err =>
        Object.keys(err.constraints)
          .map(key => err.constraints[key])
          .join(','), // convert to flat array
    );
  }

  // email Validator
  private validateEmail(email: any = null): boolean {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  }
}
