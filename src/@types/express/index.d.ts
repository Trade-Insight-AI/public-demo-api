/* eslint-disable @typescript-eslint/naming-convention */
import { TAccountPayload } from '@/modules/authenticate/strategies/jwt/jwt.strategy';
import { IAccountModel } from '@/modules/accounts/models/account.struct';

export {};

declare global {
  namespace Express {
    interface Request {
      ip?: string;
      authentication?: TAccountPayload;
      account?: IAccountModel;
    }
  }
}
