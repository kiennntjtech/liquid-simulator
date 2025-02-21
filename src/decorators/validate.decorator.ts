import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsOptional, Validate } from 'class-validator';

export function QueryParamOptional() {
  return applyDecorators(
    Transform(({ value }) => (value === '' ? undefined : value)),
    IsOptional(),
  );
}
