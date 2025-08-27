import { IApiDocumentationOptions } from '@/@decorators/api-documentation.decorator';

export const HealthCheckDocumentation: IApiDocumentationOptions = {
  summary: 'Health check',
  description: 'Endpoint to check the application health status',
  tags: ['health'],
  auth: false,
  responses: {
    success: {
      status: 200,
      description: 'Application is healthy',
      schema: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'ok',
          },
          info: {
            type: 'object',
            additionalProperties: true,
          },
          error: {
            type: 'object',
            additionalProperties: true,
          },
          details: {
            type: 'object',
            additionalProperties: true,
          },
        },
      },
    },
  },
};
