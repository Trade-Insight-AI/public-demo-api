import { Result } from '@/@shared/classes/result';
import { TIAProviderMockDelayEnum } from './tia-provider.enums';
import { ITIAProviderClassifyProductDetails } from './tia-provider-classify-product.struct';
import {
  ITIAProviderBulkClassificationResultByGroupIdResponse,
  ITIAProviderBulkClassificationsDownloadables,
  ITIAProviderBulkClassificationStatusByGroupIdResponse,
  ITIAProviderBulkClassifyDTO,
  ITIAProviderBulkClassifyQueueStatusesResponse,
  ITIAProviderBulkClassifyResponse,
} from './tia-provider-bulk-classify.struct';

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
  // Single Product
  abstract classifyProduct(
    payload: ITIAProviderClassifyProductDTO,
  ): Promise<Result<ITIAProviderClassifyProductDetails>>;

  // Bulk
  abstract bulkClassify(
    payload: ITIAProviderBulkClassifyDTO,
  ): Promise<Result<ITIAProviderBulkClassifyResponse>>;
  abstract bulkClassifyQueueStatuses(): Promise<
    Result<ITIAProviderBulkClassifyQueueStatusesResponse>
  >;
  abstract bulkClassificationsDownloadables(): Promise<
    Result<ITIAProviderBulkClassificationsDownloadables>
  >;
  abstract bulkClassificationStatusByGroupId(
    groupId: string,
  ): Promise<Result<ITIAProviderBulkClassificationStatusByGroupIdResponse>>;
  abstract deleteBulkClassificationByGroupId(
    groupId: string,
  ): Promise<Result<{ message: string }>>;
  abstract bulkClassificationResultByGroupId(
    groupId: string,
  ): Promise<Result<ITIAProviderBulkClassificationResultByGroupIdResponse>>;
  abstract cancelBulkClassificationByGroupId(
    groupId: string,
  ): Promise<Result<{ message: string }>>;
}
