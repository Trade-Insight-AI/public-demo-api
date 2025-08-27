import { ApiProperty } from '@nestjs/swagger';

export class SwaggerPaginationQueryDto {
  @ApiProperty({
    description: 'Page number',
    type: 'number',
    example: 1,
    required: false,
  })
  page?: number;

  @ApiProperty({
    description: 'Number of items per page',
    type: 'number',
    example: 10,
    required: false,
  })
  offset?: number;
}

export class SwaggerPaginationResponseDto {
  @ApiProperty({
    description: 'Total number of items',
    type: 'number',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Whether there are more items on the next page',
    type: 'boolean',
    example: true,
  })
  hasNextPage: boolean;
}
