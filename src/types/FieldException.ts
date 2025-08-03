export class FieldException extends Error {
  public errors: Record<string, string[]>;

  constructor(message: string, errors: Record<string, string[]>) {
    super(message);
    this.name = "FieldException";
    this.errors = errors;
  }
}
