export class ApiError {
  error: string;
  success: boolean;
  data: null;
  constructor(error: string) {
    this.success = false;
    this.error = error;
    this.data = null;
  }
}
