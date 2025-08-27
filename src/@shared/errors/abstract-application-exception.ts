import { HttpStatus } from '@nestjs/common';
import { IRequestContext } from '../protocols/request-context.struct';

export abstract class AbstractApplicationException extends Error {
  public statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
  public context?: IRequestContext;

  constructor(
    message: string,
    name: string,
    statusCode?: number,
    context?: IRequestContext,
  ) {
    super(message);
    this.name = name || 'AbstractApplicationException';
    this.statusCode = statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    this.context = context;
  }
}

export class DefaultException extends AbstractApplicationException {
  constructor(
    message: string,
    name: string = 'DefaultException',
    statusCode: number = HttpStatus.BAD_REQUEST,
    context?: IRequestContext,
  ) {
    super(message, name, statusCode, context);
  }
}
