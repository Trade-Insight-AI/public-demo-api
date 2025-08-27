import { Request } from 'express';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { IRequestContext } from '@/@shared/protocols/request-context.struct';
import { GenerateRandom } from '@/@shared/utils/generateRandom';
import { TAccountPayload } from '@/modules/authenticate/strategies/jwt/jwt.strategy';
import { IAccountModel } from '@/modules/accounts/models/account.struct';

export const ReqContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IRequestContext => {
    const request: Request = ctx.switchToHttp().getRequest();

    return {
      logId: GenerateRandom.id(),
      timestamp: new Date(),
      ip: request?.ip,
      userAgent: request?.headers['user-agent'],
      authentication: request?.authentication as TAccountPayload,
      account: request?.account as IAccountModel,
    };
  },
);
