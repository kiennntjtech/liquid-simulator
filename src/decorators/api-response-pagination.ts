import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { Pagination } from '@/src/utils/pagination';

class ResponseType<T> {
  data: T;

  status: 'success' | 'error';

  message?: string;
}
class ResponseDataType {}
export const ApiOkResponsePaginated = <T extends Type<unknown>>(dtoType: T) => {
  return applyDecorators(
    ApiExtraModels(ResponseType, Pagination, dtoType),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseType) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(Pagination),
                properties: {
                  items: {
                    type: 'array',
                    items: {
                      $ref: getSchemaPath(dtoType),
                    },
                  },
                },
              },
            },
          },
        ],
      },
    }),
  );
};
export const ApiOkResponseWithDto = <T extends Type<unknown>>(dtoType?: T) => {
  return applyDecorators(
    ApiExtraModels(ResponseType, dtoType || ResponseDataType),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseType) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(dtoType || ResponseDataType),
              },
            },
          },
        ],
      },
    }),
  );
};
export const ApiOkResponseWithListDtos = <T extends Type<unknown>>(
  dtoType: T,
) => {
  return applyDecorators(
    ApiExtraModels(ResponseType, dtoType),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseType) },
          {
            properties: {
              data: {
                type: 'array',
                items: {
                  $ref: getSchemaPath(dtoType),
                },
              },
            },
          },
        ],
      },
    }),
  );
};
