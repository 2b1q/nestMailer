import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((data, req) => {
  // access to User context trough decorator
  // req is Express request Object
  return data ? req.user[data] : req.user;
});
