import { Request } from 'express';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TAccountPayload } from '@/modules/authenticate/strategies/jwt/jwt.strategy';

export const CurrentAuthentication = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): TAccountPayload | undefined => {
    const request: Request = ctx.switchToHttp().getRequest();

    return request.authentication;
  },
);
