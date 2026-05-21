import type { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Signature of an async controller function. Returns a promise; resolved value
 * is ignored — controllers communicate via `res`. We type the return as
 * `Promise<unknown>` (not `Promise<void>`) so callers may `return res.json(...)`
 * without TS complaining about a discarded value.
 */
type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

/**
 * Wraps an async controller so a rejected promise is forwarded to Express's
 * error middleware instead of becoming an unhandled rejection.
 */
export const asyncHandler =
  (fn: AsyncRequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
