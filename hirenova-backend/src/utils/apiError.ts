export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly success: false;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.name = "ApiError";

    Error.captureStackTrace(this, this.constructor);
  }
}
