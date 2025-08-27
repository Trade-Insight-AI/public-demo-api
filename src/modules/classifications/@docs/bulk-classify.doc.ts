import { ApiProperty } from '@nestjs/swagger';
import { IApiDocumentationOptions } from '@/@decorators/api-documentation.decorator';
import {
  TIAProviderBulkClassificationPriorityEnum,
  TIAProviderMockDelayEnum,
} from '@/@shared/providers/tia-provider/models/tia-provider.enums';

// Request DTO Documentation
export class BulkClassifyRequestDoc {
  @ApiProperty({
    description: 'AI engine to use for bulk classification',
    example: 'E4-1',
    minLength: 1,
  })
  engine: string;

  @ApiProperty({
    description: 'Priority level for the bulk classification job',
    enum: TIAProviderBulkClassificationPriorityEnum,
    example: TIAProviderBulkClassificationPriorityEnum.NORMAL,
  })
  priority: TIAProviderBulkClassificationPriorityEnum;

  @ApiProperty({
    description: 'Whether to force reprocessing of already classified items',
    example: false,
    type: 'boolean',
  })
  forceReprocess: boolean;

  @ApiProperty({
    description: 'Optional request identifier for tracking',
    example: 'req-123456',
    required: false,
  })
  requestId?: string;

  @ApiProperty({
    description: 'Optional description for the bulk classification job',
    example: 'Monthly product catalog classification',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Enable test mode for bulk classification',
    example: false,
    required: false,
    type: 'boolean',
  })
  testMode?: boolean;

  @ApiProperty({
    description: 'Mock delay configuration for test mode',
    oneOf: [
      {
        type: 'string',
        enum: Object.values(TIAProviderMockDelayEnum),
        description: 'Predefined delay option',
      },
      {
        type: 'integer',
        minimum: 1,
        description: 'Custom delay in seconds',
      },
    ],
    example: TIAProviderMockDelayEnum.REALISTIC,
    required: false,
  })
  mockDelay?: TIAProviderMockDelayEnum | number;

  @ApiProperty({
    description: 'File to be classified (CSV)',
    type: 'string',
    format: 'binary',
    example: 'products.csv',
  })
  file: any;
}

// Response DTO Documentation
export class BulkClassifyResponseDoc {
  @ApiProperty({
    description: 'Response message from the classification service',
    example: 'Bulk classification request accepted',
  })
  message: string;

  @ApiProperty({
    description: 'Unique identifier for the bulk classification group/job',
    example: 'fbf8c4a2-3f99-4409-a5ef-5a82baa7b8f9',
  })
  group_id: string;
}

// API Documentation Options
export const BulkClassifyDocumentation: IApiDocumentationOptions = {
  summary: 'Submit bulk classification job',
  description:
    'Uploads a file containing multiple products for bulk classification using the specified AI engine. The file should be in CSV format with product descriptions.',
  tags: ['Classifications', 'Bulk'],
  auth: true,
  body: {
    description: 'Bulk classification request with file upload',
    type: BulkClassifyRequestDoc,
  },
  responses: {
    success: {
      status: 201,
      description: 'Bulk classification job submitted successfully',
      type: BulkClassifyResponseDoc,
    },
    badRequest: {
      description: 'Invalid request data or file format',
      message: 'Validation failed for the provided data',
      error: 'Bad Request',
    },
    unauthorized: {
      description: 'Authentication required',
      message: 'Unauthorized access',
      error: 'Unauthorized',
    },
    forbidden: {
      description: 'Insufficient permissions to perform bulk classification',
      message: 'Access denied',
      error: 'Forbidden',
    },
  },
};
