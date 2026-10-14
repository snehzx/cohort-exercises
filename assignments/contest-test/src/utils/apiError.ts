export class ApiError {
  error: string;
  success: boolean;
  constructor(error: string) {
    this.success = false;
    this.error = error;
  }
}
