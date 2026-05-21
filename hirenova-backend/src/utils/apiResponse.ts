export class ApiResponse<TData = unknown> {
  public readonly statusCode: number;
  public readonly success: true;
  public readonly message: string;
  public readonly data: TData | null;

  constructor(statusCode: number, message: string, data: TData | null = null) {
    this.statusCode = statusCode;
    this.success = true;
    this.message = message;
    this.data = data;
  }
}
