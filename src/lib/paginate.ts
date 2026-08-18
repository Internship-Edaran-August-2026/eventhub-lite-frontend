import type { PaginatedData } from "@/types/shared";

/**
 * json-server returns plain arrays, not the Laravel-style paginated envelope
 * the real API uses. Services fetch the full array and paginate client-side
 * so pages can keep consuming the same PaginatedData<T> shape either way.
 */
export function paginate<T>(items: T[], page: number, perPage: number): PaginatedData<T> {
  const start = (page - 1) * perPage;
  return {
    data: items.slice(start, start + perPage),
    meta: {
      current_page: page,
      last_page: Math.ceil(items.length / perPage) || 1,
      per_page: perPage,
      total: items.length,
    },
  };
}
