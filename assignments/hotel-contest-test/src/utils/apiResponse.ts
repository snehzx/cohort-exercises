export class ApiResponse<T> {
  success: boolean;
  data: T;
  error: null;
  constructor(data: T) {
    this.success = true;
    this.data = data;
    this.error = null;
  }
}
