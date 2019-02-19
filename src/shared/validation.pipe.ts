import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // if user put/post an empty partial<mail> object
    if (value instanceof Object && this.isEmpty(value)) {
      throw new HttpException(
        'Validation failed: No body submitted',
        HttpStatus.BAD_REQUEST,
      );
    }

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
    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find(type => metatype === type);
  }

  // validate if value isEmpty
  private isEmpty(value: any): boolean {
    return Object.keys(value).length <= 0;
  }

  // Parse validation constraints
  private parseErrors(errors: any[]) {
    return errors.map(err => err.constraints);
  }
}
