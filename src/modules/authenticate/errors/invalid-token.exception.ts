import { AbstractApplicationException } from '@/@shared/errors/abstract-application-exception';
import { HttpStatus } from '@nestjs/common';

export class InvalidTokenException extends AbstractApplicationException {
  constructor() {
    super(
      `Invalid token provided`,
      'InvalidTokenException',
      HttpStatus.FORBIDDEN,
    );
  }
}
