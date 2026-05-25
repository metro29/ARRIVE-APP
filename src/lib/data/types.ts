import type { CitySlug } from "@/types/geo";

/** Pagination-first query contract for scalable datasets */
export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface RestaurantListQuery extends Partial<PaginationParams> {
  citySlug: CitySlug;
}

export interface RestaurantByIdQuery {
  id: string;
  /** Optional city guard — rejects cross-city access when set */
  citySlug?: CitySlug;
}

export const DEFAULT_PAGE_SIZE = 24;
export const MAX_DISCOVER_PAGE_SIZE = 100;
export const MAX_ADMIN_PAGE_SIZE = 50;

export function normalizePagination(
  params?: Partial<PaginationParams>,
  defaults: { limit: number; maxLimit: number } = {
    limit: DEFAULT_PAGE_SIZE,
    maxLimit: MAX_DISCOVER_PAGE_SIZE,
  }
): PaginationParams {
  const limit = Math.min(
    Math.max(1, params?.limit ?? defaults.limit),
    defaults.maxLimit
  );
  const offset = Math.max(0, params?.offset ?? 0);
  return { limit, offset };
}

export function buildPaginatedResult<T>(
  items: T[],
  total: number,
  pagination: PaginationParams
): PaginatedResult<T> {
  return {
    items,
    total,
    limit: pagination.limit,
    offset: pagination.offset,
    hasMore: pagination.offset + items.length < total,
  };
}
