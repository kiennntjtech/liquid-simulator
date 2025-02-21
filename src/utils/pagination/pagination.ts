import { ApiProperty } from '@nestjs/swagger';

class PaginationParams {
  @ApiProperty()
  page: number;

  @ApiProperty()
  perpage: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  totalItems: number;
}

export class Pagination<T> {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
    },
  })
  items: T[] = [];

  @ApiProperty({
    type: PaginationParams,
  })
  pagination: PaginationParams = {
    page: 1,
    perpage: 20,
    totalPages: 0,
    totalItems: 0,
  };
}
