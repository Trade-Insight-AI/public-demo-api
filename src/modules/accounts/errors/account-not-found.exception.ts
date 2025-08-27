import { HttpStatus } from '@nestjs/common';
import { AbstractApplicationException } from '@/@shared/errors/abstract-application-exception';
import { IRequestContext } from '@/@shared/protocols/request-context.struct';

export class AccountNotFoundException extends AbstractApplicationException {
  constructor(id?: string, email?: string, context?: IRequestContext) {
    super(
      `Account with ${id ? `id ${id}` : email ? `email ${email}` : ''} not found`,
      'AccountNotFoundException',
      HttpStatus.NOT_FOUND,
      context,
    );
  }
}
