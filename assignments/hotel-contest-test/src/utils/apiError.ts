export class ApiError extends Error {
  success: false;
  data: null;
  error: string;

  constructor(error: string) {
    super(error);
    this.success = false;
    this.data = null;
    this.error = error;
  }
}
