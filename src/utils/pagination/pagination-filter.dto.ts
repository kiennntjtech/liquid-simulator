import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationFilterDto {
  @ApiProperty({ required: false, description: 'Default value is 1' })
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  page: number = 1;

  @ApiProperty({ required: false, description: 'Default value is 10' })
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  perpage: number = 10;
}
