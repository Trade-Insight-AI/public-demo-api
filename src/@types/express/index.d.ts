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

  namespace Multer {
    interface File {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      destination: string;
      filename: string;
      path: string;
      buffer: Buffer;
    }
  }
}
