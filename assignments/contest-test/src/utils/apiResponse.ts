export class ApiResponse<T> {
  success: boolean;
  data: T;
  error: null;
  constructor(data: T) {
    this.data = data;
    this.success = true;
    this.error = null;
  }
}
