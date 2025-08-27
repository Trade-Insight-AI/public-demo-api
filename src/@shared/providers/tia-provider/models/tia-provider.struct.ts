import { Result } from '@/@shared/classes/result';
import { TiaProviderMockDelayEnum } from './tia-provider.enums';
import { ITIAProviderClassifyProductDetails } from './tia-provider-classify-product.struct';

export interface ITIAProviderEnvironment {
  clientId: string;
  clientSecret: string;
}

export interface ITIAProviderListEnginesResponse {
  engines: {
    name: string;
    cost: string;
  }[];
}

export interface ITIAProviderClassifyProductDTO {
  productDescription: string;
  engine: string;
  testMode?: boolean;
  mockDelay?: TiaProviderMockDelayEnum | number;
}

export interface ITIAProviderAccountBalanceResponse {
  message: string;
  data: {
    balance: number;
    currency: string;
  };
}

export abstract class TTIAProvider {
  // Utilities
  abstract login(): Promise<Result<void>>;
  abstract listEngines(): Promise<Result<ITIAProviderListEnginesResponse>>;
  abstract accountBalance(): Promise<
    Result<ITIAProviderAccountBalanceResponse>
  >;

  // Classifications
  abstract classifyProduct(
    payload: ITIAProviderClassifyProductDTO,
  ): Promise<Result<ITIAProviderClassifyProductDetails>>;
}
