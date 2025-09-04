import { ApiProperty } from '@nestjs/swagger';
import { IApiDocumentationOptions } from '@/@decorators/api-documentation.decorator';

// Response DTO Documentation
export class BulkClassificationStatusByGroupIdResponseDoc {
  @ApiProperty({
    description: 'Unique identifier for the bulk classification group',
    example: 'fbf8c4a2-3f99-4409-a5ef-5a82baa7b8f9',
  })
  group_id: string;

  @ApiProperty({
    description: 'Organization identifier',
    example: 'org-123456',
  })
  organization_id: string;

  @ApiProperty({
    description: 'Total number of items in the classification job',
    example: 1000,
  })
  total_items: number;

  @ApiProperty({
    description: 'Number of items pending processing',
    example: 150,
  })
  pending_count: number;

  @ApiProperty({
    description: 'Number of items currently running',
    example: 25,
  })
  running_count: number;

  @ApiProperty({
    description: 'Number of items completed',
    example: 800,
  })
  completed_count: number;

  @ApiProperty({
    description: 'Number of items that failed',
    example: 25,
  })
  failed_count: number;

  @ApiProperty({
    description: 'Overall status of the classification job',
    example: 'running',
  })
  overall_status: string;

  @ApiProperty({
    description: 'Progress percentage (0-100)',
    example: 82.5,
  })
  progress_percentage: number;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  created_at: string;

  @ApiProperty({
    description: 'Total cost of the classification job',
    example: 25.5,
  })
  total_cost: number;

  @ApiProperty({
    description: 'List of AI engines used',
    type: 'array',
    items: { type: 'string' },
    example: ['E4-1', 'E4-2'],
  })
  engines_used: string[];
}

// API Documentation Options
export const BulkClassificationStatusByGroupIdDocumentation: IApiDocumentationOptions =
  {
    summary: 'Get bulk classification status by group ID',
    description:
      'Retrieves the current status and progress of a specific bulk classification job identified by its group ID.',
    tags: ['Classifications'],
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
        description: 'Classification status retrieved successfully',
        type: BulkClassificationStatusByGroupIdResponseDoc,
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
          'Insufficient permissions to view this classification status',
        message: 'Access denied',
        error: 'Forbidden',
      },
    },
  };
