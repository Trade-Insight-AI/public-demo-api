import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ZodError } from 'zod';

import { AbstractApplicationException } from '../errors/abstract-application-exception';
import { IRequestContext } from '../protocols/request-context.struct';
import { ILogger } from '../classes/custom-logger';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private logger: ILogger) {
    this.logger.setContextName(AllExceptionsFilter.name);
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let context: IRequestContext = {
      logId: request.logId,
      timestamp: new Date(),
      userAgent: request.headers['user-agent'],
      account: request.account,
      ip: request.ip,
      body: request.body,
      query: request.query,
      params: request.params,
    };

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exception.message || 'Internal server error';
    let errorName = exception.name || 'InternalServerError';
    let validationErrors: any[] | undefined;

    if (exception instanceof AbstractApplicationException) {
      statusCode = exception.statusCode;
      message = exception.message;
      errorName = exception.name;
      context = exception.context || context;

      //
    } else if (exception instanceof ZodError) {
      statusCode = HttpStatus.BAD_REQUEST;
      errorName = 'ValidationError';

      // Format Zod validation errors
      validationErrors = exception.errors.map((error) => ({
        field: error.path.join('.'),
        message: error.message,
        code: error.code,
      }));

      message = 'Validation failed';
    }

    if (exception.stack) {
      const logData = {
        ...context,
        statusCode,
        errorName,
        authentication: request.authentication,
        user: request.currentUser,
        stack: exception.stack,
      };

      if (
        [
          HttpStatus.INTERNAL_SERVER_ERROR,
          HttpStatus.NOT_IMPLEMENTED,
          HttpStatus.BAD_GATEWAY,
          HttpStatus.SERVICE_UNAVAILABLE,
          HttpStatus.GATEWAY_TIMEOUT,
        ].includes(statusCode)
      ) {
        if (logData.errorName !== 'ValidationError') {
          this.logger.error(message, logData);
        }
      } else {
        this.logger.debug(message, logData);
      }
    }

    let errorResponse: any = {
      logId: context.logId,
      statusCode,
      message,
      name: errorName,
      timestamp: context.timestamp?.toISOString(),
      path: request.url,
    };

    // Add validation errors to response if they exist
    if (validationErrors) {
      errorResponse.errors = validationErrors;

      this.logger.warn(message, errorResponse);
    }

    if (exception instanceof HttpException) {
      errorResponse.statusCode = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'object') {
        errorResponse = { ...errorResponse, ...res };
      } else {
        errorResponse.message = res;
      }

      errorResponse.name = exception.name;
    }

    response.status(statusCode).json(errorResponse);
  }
}
