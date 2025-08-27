import { Injectable } from '@nestjs/common';
import { AbstractPresenter } from '@/@shared/classes/presenter';
import { IAccountModel } from '../models/account.struct';

export type TAccountBasicPresenterResponse = Omit<
  IAccountModel,
  'createdAt' | 'updatedAt' | 'deletedAt' | 'password'
>;

export type TAccountPresenterResponse = TAccountBasicPresenterResponse & {
  // Relations
};

export abstract class IAccountPresenter extends AbstractPresenter<
  IAccountModel,
  TAccountPresenterResponse
> {
  abstract presentWithoutTokens(
    account: IAccountModel,
  ): Omit<
    TAccountBasicPresenterResponse,
    'accessToken' | 'refreshToken' | 'tiaAccessToken'
  >;
}

@Injectable()
export class AccountPresenter implements IAccountPresenter {
  constructor() {}

  present(account: IAccountModel): TAccountPresenterResponse {
    return {
      id: account.id,
      email: account.email,
      accessToken: account.accessToken,
      refreshToken: account.refreshToken,
    };
  }

  presentWithoutRelations(
    account: IAccountModel,
  ): Omit<TAccountPresenterResponse, ''> {
    return {
      id: account.id,
      email: account.email,
      accessToken: account.accessToken,
      refreshToken: account.refreshToken,
    };
  }

  presentMany(accounts: IAccountModel[]): TAccountPresenterResponse[] {
    return accounts.map((account) => this.present(account));
  }

  presentWithoutTokens(
    account: IAccountModel,
  ): Omit<TAccountBasicPresenterResponse, 'accessToken' | 'refreshToken'> {
    return {
      id: account.id,
      email: account.email,
    };
  }
}
