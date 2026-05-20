/**
 * Shared pagination helpers.
 *
 * WHY A HELPER? Every paginated service does the same arithmetic:
 *   const pageNum = Math.max(1, Number(page));
 *   const limitNum = Math.max(1, Number(limit));
 *   const skip = (pageNum - 1) * limitNum;
 *
 * Three services, same three lines each. Move it here so the logic is tested
 * and changed in one place. Services become declarative:
 *
 *   const { pageNum, limitNum, skip } = parsePagination(query);
 */

import type { PaginationQuery } from "../types/pagination.types.js";

export interface ParsedPagination {
  pageNum: number;
  limitNum: number;
  skip: number;
}

/**
 * Safely parse page + limit from a query string, apply sane defaults and
 * minimum bounds, then compute the MongoDB skip value.
 *
 * @param query - Raw PaginationQuery (strings from req.query or numbers)
 * @param defaultLimit - Default items per page (varies by endpoint)
 */
export const parsePagination = (
  query: PaginationQuery,
  defaultLimit = 10,
): ParsedPagination => {
  const pageNum = Math.max(1, Number(query.page ?? 1));
  const limitNum = Math.max(1, Math.min(100, Number(query.limit ?? defaultLimit)));
  const skip = (pageNum - 1) * limitNum;
  return { pageNum, limitNum, skip };
};

/**
 * Calculate total pages from a document count and items-per-page.
 */
export const calcPages = (total: number, limitNum: number): number =>
  Math.ceil(total / limitNum);
