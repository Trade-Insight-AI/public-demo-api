import { AbstractApplicationException } from '@/@shared/errors/abstract-application-exception';
import { HttpStatus } from '@nestjs/common';

export class AccountAlreadyExistsException extends AbstractApplicationException {
  constructor() {
    super(
      `Account already exists`,
      'AccountAlreadyExistsException',
      HttpStatus.CONFLICT,
    );
  }
}
