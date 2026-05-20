/**
 * Shared pagination types.
 *
 * WHY SHARED? The pattern { items, total, page, pages } appears in jobs,
 * applications, and user listings. Without a shared type, each module defines
 * its own version (JobsPage, ApplicantsPage …) with slightly different field
 * names. Adding `hasNextPage` later means touching every module separately.
 *
 * DESIGN: Generic over the item type so callers get full inference:
 *   const result: PaginatedResult<JobDocument> = ...
 */

// ─── Input ────────────────────────────────────────────────────────────────────

/**
 * The raw query-string shape for paginated endpoints.
 * Values arrive as strings from req.query; services call Number() internally.
 */
export interface PaginationQuery {
  page?: string | number;
  limit?: string | number;
}

// ─── Output ───────────────────────────────────────────────────────────────────

/**
 * The standard paginated response shape used by all list endpoints.
 * Replace per-module JobsPage / ApplicantsPage / etc. with this.
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}
