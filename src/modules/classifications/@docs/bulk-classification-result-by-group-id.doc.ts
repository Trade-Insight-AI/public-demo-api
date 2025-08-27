import { ApiProperty } from '@nestjs/swagger';
import { IApiDocumentationOptions } from '@/@decorators/api-documentation.decorator';

// Response DTO Documentation
export class BulkClassificationResultDoc {
  @ApiProperty({
    description: 'Product description that was classified',
    example: 'Wireless Bluetooth headphones with noise cancellation',
  })
  product_description: string;

  @ApiProperty({
    description: 'TIA classification result',
    example: 'Electronics > Audio > Headphones',
  })
  tia_classification: string;

  @ApiProperty({
    description: 'AI engine used for classification',
    example: 'E4-1',
  })
  engine: string;

  @ApiProperty({
    description: 'Detailed classification result',
    example: 'Electronics/Audio/Headphones/Bluetooth/Noise-Cancelling',
  })
  classification_result: string;
}

export class BulkClassificationResultByGroupIdResponseDoc {
  @ApiProperty({
    description: 'Group ID for the classification results',
    example: 'fbf8c4a2-3f99-4409-a5ef-5a82baa7b8f9',
  })
  groupId: string;

  @ApiProperty({
    description: 'Total number of results',
    example: 1000,
  })
  totalResults: number;

  @ApiProperty({
    description: 'List of classification results',
    type: [BulkClassificationResultDoc],
  })
  results: BulkClassificationResultDoc[];
}

// API Documentation Options
export const BulkClassificationResultByGroupIdDocumentation: IApiDocumentationOptions =
  {
    summary: 'Get bulk classification results by group ID',
    description:
      'Retrieves the complete classification results for a specific bulk classification job identified by its group ID.',
    tags: ['Classifications', 'Bulk'],
    auth: true,
    params: [
      {
        name: 'groupId',
        description: 'Unique identifier for the bulk classification group',
        type: 'string',
      },
    ],
    responses: {
      success: {
        status: 200,
        description: 'Classification results retrieved successfully',
        type: BulkClassificationResultByGroupIdResponseDoc,
      },
      notFound: {
        description: 'Classification group not found',
        message: 'No classification found for the provided group ID',
        error: 'Not Found',
      },
      unauthorized: {
        description: 'Authentication required',
        message: 'Unauthorized access',
        error: 'Unauthorized',
      },
      forbidden: {
        description:
          'Insufficient permissions to view these classification results',
        message: 'Access denied',
        error: 'Forbidden',
      },
    },
  };
