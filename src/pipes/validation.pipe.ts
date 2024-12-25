import { BadRequestException, ValidationPipe as Pipe } from '@nestjs/common'

export const ValidationPipe = new Pipe({
  whitelist: true,
  stopAtFirstError: true,
  exceptionFactory(errors) {
    const error = errors[0].constraints
      ? errors[0].constraints[Object.keys(errors[0].constraints)[0]]
      : 'Unknown validation error'
    return new BadRequestException(error)
  },
})
