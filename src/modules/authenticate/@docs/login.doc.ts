import { ApiProperty } from '@nestjs/swagger';
import { IApiDocumentationOptions } from '@/@decorators/api-documentation.decorator';
import { SwaggerAccountResponseDto } from '@/modules/accounts/@docs/account-response.doc';

export class SwaggerLoginBodyDto {
  @ApiProperty({
    description: 'User email',
    type: 'string',
    format: 'email',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User password',
    type: 'string',
    minLength: 6,
    example: 'password123',
  })
  password: string;
}

export class SwaggerLoginResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    type: 'string',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'JWT refresh token',
    type: 'string',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Account data',
    type: SwaggerAccountResponseDto,
  })
  account: SwaggerAccountResponseDto;
}

export const LoginDocumentation: IApiDocumentationOptions = {
  summary: 'Login user',
  description: 'Endpoint to authenticate a user and generate access tokens',
  tags: ['Authentication'],
  auth: false,
  body: {
    description: 'User credentials',
    type: SwaggerLoginBodyDto,
  },
  responses: {
    success: {
      status: 200,
      description: 'User authenticated successfully',
      type: SwaggerLoginResponseDto,
    },
    badRequest: {
      description: 'Invalid credentials format',
    },
    unauthorized: {
      description: 'Invalid email or password',
    },
  },
};
