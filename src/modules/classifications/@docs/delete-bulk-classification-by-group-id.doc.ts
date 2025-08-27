import { ApiProperty } from '@nestjs/swagger';
import { IApiDocumentationOptions } from '@/@decorators/api-documentation.decorator';

// Response DTO Documentation
export class DeleteBulkClassificationByGroupIdResponseDoc {
  @ApiProperty({
    description: 'Response message from the deletion operation',
    example: 'Bulk classification deleted successfully',
  })
  message: string;
}

// API Documentation Options
export const DeleteBulkClassificationByGroupIdDocumentation: IApiDocumentationOptions =
  {
    summary: 'Delete bulk classification by group ID',
    description:
      'Deletes a bulk classification job and all its associated data identified by the group ID.',
    tags: ['Classifications', 'Bulk'],
    auth: true,
    params: [
      {
        name: 'groupId',
        description:
          'Unique identifier for the bulk classification group to delete',
        type: 'string',
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
