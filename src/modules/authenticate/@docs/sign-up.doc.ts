import { ApiProperty } from '@nestjs/swagger';
import { IApiDocumentationOptions } from '@/@decorators/api-documentation.decorator';
import { SwaggerAccountWithoutTokensResponseDto } from '@/modules/accounts/@docs/account-response.doc';

export class SwaggerSignUpBodyDto {
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

export class SwaggerSignUpResponseDto {
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
    type: SwaggerAccountWithoutTokensResponseDto,
  })
  account: SwaggerAccountWithoutTokensResponseDto;
}

export const SignUpDocumentation: IApiDocumentationOptions = {
  summary: 'Sign up user',
  description: 'Endpoint to register a new user and generate access tokens',
  tags: ['Authentication'],
  auth: false,
  body: {
    description: 'User registration data',
    type: SwaggerSignUpBodyDto,
  },
  responses: {
    success: {
      status: 201,
      description: 'User registered successfully',
      type: SwaggerSignUpResponseDto,
    },
    badRequest: {
      description: 'Invalid registration data',
    },
    conflict: {
      description: 'Email already exists',
    },
  },
};
