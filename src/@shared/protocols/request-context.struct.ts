import { IAccountModel } from '@/modules/accounts/models/account.struct';
import { TAccountPayload } from '@/modules/authenticate/strategies/jwt/jwt.strategy';

export interface IRequestContext {
  logId: string;
  timestamp?: Date;
  userAgent?: string;
  ip?: string;
  authentication?: TAccountPayload;
  account?: IAccountModel;
  query?: Record<string, any>;
  body?: Record<string, any>;
  params?: Record<string, any>;
}
