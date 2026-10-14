export class ApiResponse<T> {
  success: boolean;
  data: T;
  constructor(data: T) {
    this.data = data;
    this.success = true;
  }
}
