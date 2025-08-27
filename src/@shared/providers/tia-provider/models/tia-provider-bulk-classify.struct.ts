import {
  TIAProviderBulkClassificationPriorityEnum,
  TIAProviderMockDelayEnum,
} from './tia-provider.enums';

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

export interface ITIAProviderBulkClassifyQueueStatusesResponse {
  queued_count?: number;
  processing_count?: number;
  completed_count?: number;
  failed_count?: number;
  total_count?: number;
  pending_items_count?: number;
  running_items_count?: number;
  completed_items_count?: number;
  failed_items_count?: number;
  total_items_count?: number;
  success_rate?: number;
  avg_processing_time_ms?: number;
  throughput_per_hour?: number;
  timestamp?: string;
}

export interface ITIAProviderBulkClassificationsDownloadables {
  downloadable_classifications: {
    groups: {
      group_id: string;
      description: string;
      created_at: string;
      total_items: number;
      completed_count: number;
      failed_count: number;
      engines_used: string[];
    }[];
  };
}

export interface ITIAProviderBulkClassificationStatusByGroupIdResponse {
  group_id: string;
  organization_id: string;
  total_items: number;
  pending_count: number;
  running_count: number;
  completed_count: number;
  failed_count: number;
  overall_status: string;
  progress_percentage: number;
  created_at: string;
  total_cost: number;
  engines_used: string[];
}

export interface ITIAProviderBulkClassificationResultByGroupIdResponse {
  groupId: string;
  totalResults: number;
  results: {
    product_description: string;
    tia_classification: string;
    engine: string;
    classification_result: string;
  }[];
}
