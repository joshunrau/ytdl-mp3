class BaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotADirectoryError extends BaseError {
  constructor(message: string) {
    super(message);
  }
}

export class VideoInfoFetchError extends BaseError {
  constructor(message: string) {
    super(message);
  }
}