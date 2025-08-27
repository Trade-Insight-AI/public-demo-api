import { ApiProperty } from '@nestjs/swagger';

export class SwaggerAccountResponseDto {
  @ApiProperty({
    description: 'Account ID',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Account email',
    type: 'string',
    example: 'user@example.com',
  })
  email: string;

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
}

export class SwaggerAccountWithoutTokensResponseDto {
  @ApiProperty({
    description: 'Account ID',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Account email',
    type: 'string',
    example: 'user@example.com',
  })
  email: string;
}
