/**
 * Shared, generic API-response shapes reused by every resource's service
 * layer. Real EventHub returns paginated Laravel-style responses; the mock
 * handlers in src/mocks reproduce this exact envelope so the pattern taught
 * here matches the production app.
 */

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedData<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
