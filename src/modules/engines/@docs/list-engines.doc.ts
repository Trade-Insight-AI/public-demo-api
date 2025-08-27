import { IApiDocumentationOptions } from '@/@decorators/api-documentation.decorator';

export const ListEnginesDocumentation: IApiDocumentationOptions = {
  summary: 'List all engines',
  description: 'Endpoint to list all available engines with their costs',
  tags: ['engines'],
  auth: false,
  responses: {
    success: {
      status: 200,
      description: 'List of engines returned successfully',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'E4-1' },
            cost: { type: 'string', example: '10.00' },
          },
        },
      },
    },
  },
};
