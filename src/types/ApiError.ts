export class ApiError extends Error {
  status: number;
  message: string;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.message = message;
    this.status = status;
    this.errors = errors;
  }
}
