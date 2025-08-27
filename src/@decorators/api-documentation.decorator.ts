import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiQuery,
} from '@nestjs/swagger';

export interface IApiDocumentationOptions {
  summary: string;
  description: string;
  tags?: string[];
  auth?: boolean;
  params?: Array<{
    name: string;
    description: string;
    type?: string;
    format?: string;
  }>;
  queries?: Array<{
    name: string;
    description: string;
    type?: any; // Type can be string or constructor
    required?: boolean;
    enum?: any;
    isArray?: boolean;
    example?: any;
  }>;
  body?: {
    description?: string;
    type: any;
    schema?: any;
  };
  responses?: {
    success?: {
      status: number;
      description: string;
      type?: any;
      schema?: any;
    };
    created?: {
      description: string;
      type?: any;
      schema?: any;
    };
    badRequest?: {
      description: string;
      message?: string;
      error?: string;
    };
    unauthorized?: {
      description: string;
      message?: string;
      error?: string;
    };
    forbidden?: {
      description: string;
      message?: string;
      error?: string;
    };
    notFound?: {
      description: string;
      message?: string;
      error?: string;
    };
    conflict?: {
      description: string;
      message?: string;
      error?: string;
    };
  };
}

export function ApiDocumentation(options: IApiDocumentationOptions) {
  const decorators: Array<
    ClassDecorator | MethodDecorator | PropertyDecorator
  > = [];

  // Tags
  if (options.tags && options.tags.length > 0) {
    decorators.push(...options.tags.map((tag) => ApiTags(tag)));
  }

  // Auth
  if (options.auth !== false) {
    decorators.push(ApiBearerAuth());
  }

  // Operation
  decorators.push(
    ApiOperation({
      summary: options.summary,
      description: options.description,
    }),
  );

  // Parameters
  if (options.params) {
    options.params.forEach((param) => {
      decorators.push(
        ApiParam({
          name: param.name,
          description: param.description,
          type: param.type || 'string',
          format: param.format,
        }),
      );
    });
  }

  // Query Parameters
  if (options.queries) {
    options.queries.forEach((query) => {
      decorators.push(
        ApiQuery({
          name: query.name,
          description: query.description,
          type: query.type || 'string',
          required: query.required || false,
          enum: query.enum,
          isArray: query.isArray || false,
          example: query.example,
        }),
      );
    });
  }

  // Body
  if (options.body) {
    if (options.body.type) {
      decorators.push(
        ApiBody({
          description: options.body.description,
          type: options.body.type,
        }),
      );
    } else if (options.body.schema) {
      decorators.push(
        ApiBody({
          description: options.body.description,
          schema: options.body.schema,
        }),
      );
    }
  }

  // Responses
  if (options.responses) {
    // Success response
    if (options.responses.success) {
      const { status, description, type, schema } = options.responses.success;
      if (type) {
        decorators.push(
          ApiResponse({
            status,
            description,
            type,
          }),
        );
      } else if (schema) {
        decorators.push(
          ApiResponse({
            status,
            description,
            schema,
          }),
        );
      }
    }

    // Created response
    if (options.responses.created) {
      const { description, type, schema } = options.responses.created;
      if (type) {
        decorators.push(
          ApiCreatedResponse({
            description,
            type,
          }),
        );
      } else if (schema) {
        decorators.push(
          ApiCreatedResponse({
            description,
            schema,
          }),
        );
      }
    }

    // Not Found response
    if (options.responses.notFound) {
      const { description, message, error } = options.responses.notFound;
      decorators.push(
        ApiNotFoundResponse({
          description,
          schema: {
            type: 'object',
            properties: {
              statusCode: { type: 'number', example: 404 },
              message: {
                type: 'string',
                example: message || 'Not found',
              },
              error: {
                type: 'string',
                example: error || 'Not Found',
              },
            },
          },
        }),
      );
    }

    // Forbidden response
    if (options.responses.forbidden) {
      const { description, message, error } = options.responses.forbidden;
      decorators.push(
        ApiForbiddenResponse({
          description,
          schema: {
            type: 'object',
            properties: {
              statusCode: { type: 'number', example: 403 },
              message: {
                type: 'string',
                example: message || 'Forbidden',
              },
              error: {
                type: 'string',
                example: error || 'Forbidden',
              },
            },
          },
        }),
      );
    }

    // Unauthorized response
    if (options.responses.unauthorized) {
      const { description, message, error } = options.responses.unauthorized;
      decorators.push(
        ApiUnauthorizedResponse({
          description,
          schema: {
            type: 'object',
            properties: {
              statusCode: { type: 'number', example: 401 },
              message: {
                type: 'string',
                example: message || 'Unauthorized',
              },
              error: {
                type: 'string',
                example: error || 'Unauthorized',
              },
            },
          },
        }),
      );
    }

    // Bad Request response
    if (options.responses.badRequest) {
      const { description, message, error } = options.responses.badRequest;
      decorators.push(
        ApiBadRequestResponse({
          description,
          schema: {
            type: 'object',
            properties: {
              statusCode: { type: 'number', example: 400 },
              message: {
                type: 'string',
                example: message || 'Bad Request',
              },
              error: {
                type: 'string',
                example: error || 'Bad Request',
              },
            },
          },
        }),
      );
    }

    // Conflict response
    if (options.responses.conflict) {
      const { description, message, error } = options.responses.conflict;
      decorators.push(
        ApiConflictResponse({
          description,
          schema: {
            type: 'object',
            properties: {
              statusCode: { type: 'number', example: 409 },
              message: {
                type: 'string',
                example: message || 'Conflict',
              },
              error: {
                type: 'string',
                example: error || 'Conflict',
              },
            },
          },
        }),
      );
    }
  }

  return applyDecorators(...decorators);
}
