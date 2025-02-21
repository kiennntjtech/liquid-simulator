import { Pagination } from './pagination';

export function buildPagination<T>(params: {
  items: T[];
  totalItems: number;
  page: number;
  perpage: number;
}): Pagination<T> {
  const { items, totalItems, page, perpage } = params;
  const totalPages = Math.ceil(totalItems / perpage);
  const pagination = new Pagination<T>();
  pagination.items = items;
  pagination.pagination = {
    page,
    perpage,
    totalPages,
    totalItems,
  };
  return pagination;
}
