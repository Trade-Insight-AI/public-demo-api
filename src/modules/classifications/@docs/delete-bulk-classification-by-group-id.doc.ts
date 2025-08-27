import { ApiProperty } from '@nestjs/swagger';

// Response DTO Documentation
export class DeleteBulkClassificationByGroupIdResponseDoc {
  @ApiProperty({
    description: 'Response message from the deletion operation',
    example: 'Bulk classification deleted successfully',
  })
  message: string;
}

// API Documentation Options
export const DeleteBulkClassificationByGroupIdDocumentation = {
  summary: 'Delete bulk classification by group ID',
  description:
    'Deletes a bulk classification job and all its associated data identified by the group ID.',
  tags: ['Classifications', 'Bulk'],
  auth: true,
  parameters: [
    {
      name: 'groupId',
      in: 'path',
      description:
        'Unique identifier for the bulk classification group to delete',
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
      description: 'Bulk classification deleted successfully',
      type: DeleteBulkClassificationByGroupIdResponseDoc,
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
      description: 'Insufficient permissions to delete this classification',
      message: 'Access denied',
      error: 'Forbidden',
    },
  },
};
