import { ApiProperty } from '@nestjs/swagger';

// Response DTO Documentation
export class CancelBulkClassificationByGroupIdResponseDoc {
  @ApiProperty({
    description: 'Response message from the cancellation operation',
    example: 'Bulk classification cancelled successfully',
  })
  message: string;
}

// API Documentation Options
export const CancelBulkClassificationByGroupIdDocumentation = {
  summary: 'Cancel bulk classification by group ID',
  description:
    'Cancels a running bulk classification job identified by the group ID. The job will stop processing any remaining items.',
  tags: ['Classifications', 'Bulk'],
  auth: true,
  parameters: [
    {
      name: 'groupId',
      in: 'path',
      description:
        'Unique identifier for the bulk classification group to cancel',
      required: true,
      schema: {
        type: 'string',
        example: 'fbf8c4a2-3f99-4409-a5ef-5a82baa7b8f9',
      },
    },
  ],
  responses: {
    success: {
      status: 200,
      description: 'Bulk classification cancelled successfully',
      type: CancelBulkClassificationByGroupIdResponseDoc,
    },
    notFound: {
      description: 'Classification group not found',
      message: 'No classification found for the provided group ID',
      error: 'Not Found',
    },
    badRequest: {
      description:
        'Cannot cancel completed or already cancelled classification',
      message: 'Classification cannot be cancelled in its current state',
      error: 'Bad Request',
    },
    unauthorized: {
      description: 'Authentication required',
      message: 'Unauthorized access',
      error: 'Unauthorized',
    },
    forbidden: {
      description: 'Insufficient permissions to cancel this classification',
      message: 'Access denied',
      error: 'Forbidden',
    },
  },
};
