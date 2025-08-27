import { ApiProperty } from '@nestjs/swagger';
import { IApiDocumentationOptions } from '@/@decorators/api-documentation.decorator';
import { SwaggerAccountResponseDto } from './account-response.doc';

export class SwaggerCreateAccountBodyDto {
  @ApiProperty({
    description: 'Account email',
    type: 'string',
    format: 'email',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Account password',
    type: 'string',
    example: 'password123',
  })
  password: string;
}

export const CreateAccountDocumentation: IApiDocumentationOptions = {
  summary: 'Create a new account',
  description:
    'Endpoint to create a new account in the system, used mainly during authentication/registration process',
  tags: ['accounts'],
  auth: true,
  body: {
    description: 'Account data to be created',
    type: SwaggerCreateAccountBodyDto,
  },
  responses: {
    success: {
      status: 201,
      description: 'Account created successfully',
      type: SwaggerAccountResponseDto,
    },
    badRequest: {
      description: 'Invalid data',
    },
    unauthorized: {
      description: 'Unauthorized',
    },
    forbidden: {
      description: 'No permission to execute this action',
    },
    conflict: {
      description: 'Account already exists with this email',
    },
  },
};
