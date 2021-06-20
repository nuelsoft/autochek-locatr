export class Response<T> {
  message?: string;
  data?: T;
  constructor({ message, data }: { message?: string; data?: T }) {
    this.message = message;
    this.data = data;
  }
}
