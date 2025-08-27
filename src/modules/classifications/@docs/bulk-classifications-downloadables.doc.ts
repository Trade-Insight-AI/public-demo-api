import { ApiProperty } from '@nestjs/swagger';

// Response DTO Documentation
export class BulkClassificationGroupDoc {
  @ApiProperty({
    description: 'Unique identifier for the classification group',
    example: 'fbf8c4a2-3f99-4409-a5ef-5a82baa7b8f9',
  })
  group_id: string;

  @ApiProperty({
    description: 'Description of the classification group',
    example: 'Monthly product catalog classification',
  })
  description: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  created_at: string;

  @ApiProperty({
    description: 'Total number of items in the group',
    example: 1000,
  })
  total_items: number;

  @ApiProperty({
    description: 'Number of completed classifications',
    example: 950,
  })
  completed_count: number;

  @ApiProperty({
    description: 'Number of failed classifications',
    example: 50,
  })
  failed_count: number;

  @ApiProperty({
    description: 'List of AI engines used for classification',
    type: 'array',
    items: { type: 'string' },
    example: ['E4-1', 'E4-2'],
  })
  engines_used: string[];
}

export class BulkClassificationsDownloadablesResponseDoc {
  @ApiProperty({
    description: 'List of classification groups available for download',
    type: [BulkClassificationGroupDoc],
  })
  groups: BulkClassificationGroupDoc[];
}

// API Documentation Options
export const BulkClassificationsDownloadablesDocumentation = {
  summary: 'Get bulk classifications available for download',
  description:
    'Retrieves a list of completed bulk classification jobs that are available for download.',
  tags: ['Classifications', 'Bulk'],
  auth: true,
  responses: {
    success: {
      status: 200,
      description: 'Downloadables retrieved successfully',
      type: BulkClassificationsDownloadablesResponseDoc,
    },
    unauthorized: {
      description: 'Authentication required',
      message: 'Unauthorized access',
      error: 'Unauthorized',
    },
    forbidden: {
      description: 'Insufficient permissions to view downloadables',
      message: 'Access denied',
      error: 'Forbidden',
    },
  },
};
