import { ApiProperty } from '@nestjs/swagger';

// Response DTO Documentation
export class BulkClassifyQueueStatusesResponseDoc {
  @ApiProperty({
    description: 'Number of items currently queued for processing',
    example: 150,
    required: false,
  })
  queued_count?: number;

  @ApiProperty({
    description: 'Number of items currently being processed',
    example: 25,
    required: false,
  })
  processing_count?: number;

  @ApiProperty({
    description: 'Number of items that have been completed',
    example: 200,
    required: false,
  })
  completed_count?: number;

  @ApiProperty({
    description: 'Number of items that have failed processing',
    example: 5,
    required: false,
  })
  failed_count?: number;

  @ApiProperty({
    description: 'Total number of items in the queue',
    example: 380,
    required: false,
  })
  total_count?: number;

  @ApiProperty({
    description: 'Number of pending items',
    example: 150,
    required: false,
  })
  pending_items_count?: number;

  @ApiProperty({
    description: 'Number of items currently running',
    example: 25,
    required: false,
  })
  running_items_count?: number;

  @ApiProperty({
    description: 'Number of completed items',
    example: 200,
    required: false,
  })
  completed_items_count?: number;

  @ApiProperty({
    description: 'Number of failed items',
    example: 5,
    required: false,
  })
  failed_items_count?: number;

  @ApiProperty({
    description: 'Total number of items',
    example: 380,
    required: false,
  })
  total_items_count?: number;

  @ApiProperty({
    description: 'Success rate percentage',
    example: 94.7,
    required: false,
  })
  success_rate?: number;

  @ApiProperty({
    description: 'Average processing time in milliseconds',
    example: 1250,
    required: false,
  })
  avg_processing_time_ms?: number;

  @ApiProperty({
    description: 'Throughput per hour',
    example: 2880,
    required: false,
  })
  throughput_per_hour?: number;

  @ApiProperty({
    description: 'Timestamp of the status report',
    example: '2024-01-15T10:30:00Z',
    required: false,
  })
  timestamp?: string;
}

// API Documentation Options
export const BulkClassifyQueueStatusesDocumentation = {
  summary: 'Get bulk classification queue statuses',
  description:
    'Retrieves the current status of the bulk classification queue, including counts of queued, processing, completed, and failed items.',
  tags: ['Classifications', 'Bulk'],
  auth: true,
  responses: {
    success: {
      status: 200,
      description: 'Queue statuses retrieved successfully',
      type: BulkClassifyQueueStatusesResponseDoc,
    },
    unauthorized: {
      description: 'Authentication required',
      message: 'Unauthorized access',
      error: 'Unauthorized',
    },
    forbidden: {
      description: 'Insufficient permissions to view queue statuses',
      message: 'Access denied',
      error: 'Forbidden',
    },
  },
};
