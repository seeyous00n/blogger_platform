import { Response } from 'express';
import { HTTP_MESSAGE, HTTP_STATUS_CODE } from '../settings';

export class NotFoundError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
  }
}

export class AuthError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
  }
}

export const sendError = (error: any, res: Response) => {
  if (error instanceof NotFoundError) {
    res.status(HTTP_STATUS_CODE.NOT_FOUND_404).json(error.message);
    return;
  } else if (error instanceof ValidationError) {
    res.status(HTTP_STATUS_CODE.BAD_REQUEST_400).json(JSON.parse(error.message));
    return;
  } else if (error instanceof AuthError) {
    res.status(HTTP_STATUS_CODE.UNAUTHORIZED_401).json(error.message);
    return;
  }

  res.status(HTTP_STATUS_CODE.SERVER_ERROR_500).json(HTTP_MESSAGE.SERVER_ERROR);
};

