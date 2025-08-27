import { Result } from '@/@shared/classes/result';
import {
  TIAProviderBulkClassificationPriorityEnum,
  TIAProviderMockDelayEnum,
} from './tia-provider.enums';
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

export interface ITIAProviderAccountBalanceResponse {
  message: string;
  data: {
    balance: number;
    currency: string;
  };
}

export interface ITIAProviderClassificationsCountsResponse {
  count: number;
}

export interface ITIAProviderClassifyProductDTO {
  productDescription: string;
  engine: string;
  testMode?: boolean;
  mockDelay?: TIAProviderMockDelayEnum | number;
}

export interface ITIAProviderBulkClassifyDTO {
  engine: string;
  priority: TIAProviderBulkClassificationPriorityEnum;
  forceReprocess: boolean;
  file: {
    buffer: Buffer<ArrayBufferLike>;
    originalname: string;
    mimetype: string;
    size: number;
  };

  requestId?: string;
  description?: string;
  testMode?: boolean;
  mockDelay?: TIAProviderMockDelayEnum | number;
}

export interface ITIAProviderBulkClassifyResponse {
  message: string;
  group_id: string;
}

export abstract class TTIAProvider {
  /// //////////////////////////
  //  Utilities
  /// //////////////////////////
  abstract login(): Promise<Result<void>>;
  abstract listEngines(): Promise<Result<ITIAProviderListEnginesResponse>>;
  abstract accountBalance(): Promise<
    Result<ITIAProviderAccountBalanceResponse>
  >;

  /// //////////////////////////
  //  Classifciations
  /// //////////////////////////
  abstract classificationsCounts(): Promise<
    Result<ITIAProviderClassificationsCountsResponse>
  >;

  // Single Product
  abstract classifyProduct(
    payload: ITIAProviderClassifyProductDTO,
  ): Promise<Result<ITIAProviderClassifyProductDetails>>;

  // Bulk
  abstract bulkClassify(
    payload: ITIAProviderBulkClassifyDTO,
  ): Promise<Result<ITIAProviderBulkClassifyResponse>>;
}
