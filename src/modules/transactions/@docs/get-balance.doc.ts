import { IApiDocumentationOptions } from '@/@decorators/api-documentation.decorator';

export const GetBalanceDocumentation: IApiDocumentationOptions = {
  summary: 'Get account balance',
  description: 'Endpoint to get the current account balance from TIA provider',
  tags: ['Transactions'],
  responses: {
    success: {
      status: 200,
      description: 'Account balance retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          data: {
            type: 'object',
            properties: {
              balance: { type: 'number' },
              currency: { type: 'string' },
            },
          },
        },
      },
    },
    unauthorized: {
      description: 'Unauthorized',
    },
  },
};
