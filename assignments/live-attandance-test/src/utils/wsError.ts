export class WsError {
  event = "ERROR";
  data: {
    message: string;
  };
  constructor(message: string) {
    this.data = { message };
  }
}
