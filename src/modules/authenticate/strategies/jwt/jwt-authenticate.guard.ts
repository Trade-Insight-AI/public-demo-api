import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { IS_PUBLIC_KEY } from '../../metadatas-for-decorators';
import { TGetCurrentUserService } from '../../services/get-current-user.service';
import { TAccountPayload } from './jwt.strategy';
import { ILogger } from '@/@shared/classes/custom-logger';

@Injectable()
export class JwtAuthenticateGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private getCurrentUserService: TGetCurrentUserService,
    public logger: ILogger,
  ) {
    super();
    this.logger.setContextName(JwtAuthenticateGuard.name);
  }

  handleRequest<TAccount = any>(
    err: any,
    user: TAccountPayload,
    _: any,
    context: ExecutionContext,
  ): TAccount {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    const req: Request = context.switchToHttp().getRequest();

    req.authentication = user;

    return user as TAccount;
  }

  async canActivate(context: ExecutionContext) {
    const { isPublic } = this.getMetadata(context);

    if (isPublic) {
      return true;
    }

    const can = await super.canActivate(context);

    if (!can) return false;

    return await this.getCurrentUser(context);
  }

  async getCurrentUser(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    const sub = (req.authentication as TAccountPayload)?.sub;

    if (sub) {
      const getCurrentUserResult = await this.getCurrentUserService.execute({
        sub,
      });

      if (getCurrentUserResult.error) {
        throw getCurrentUserResult.error;
      }

      req.account = getCurrentUserResult.getValue()!;
    }

    return true;
  }

  private getMetadata(context: ExecutionContext) {
    const isPublic =
      this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? false;

    return {
      isPublic,
    };
  }
}
