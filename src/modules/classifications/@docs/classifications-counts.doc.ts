import { ApiProperty } from '@nestjs/swagger';
import { IApiDocumentationOptions } from '@/@decorators/api-documentation.decorator';

// Response DTO Documentation
export class ClassificationsCountsResponseDoc {
  @ApiProperty({
    description: 'Total number of classifications available',
    example: 150,
    type: 'number',
  })
  count: number;
}

// Main Documentation
export const ClassificationsCountsDocumentation: IApiDocumentationOptions = {
  summary: 'Get classifications counts',
  description:
    'Retrieves the total count of available classifications from the TIA provider',
  tags: ['Classifications'],
  auth: true,
  responses: {
    success: {
      status: 200,
      description: 'Classifications counts retrieved successfully',
      type: ClassificationsCountsResponseDoc,
    },
  },
};
