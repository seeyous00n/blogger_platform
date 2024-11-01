import { Response } from 'express';
import { HTTP_STATUS_CODE } from './settings';

export class NotFoundError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
  }
}

export const TYPE_ERROR = {
  'NOT_FOUND': 'NOT_FOUND',
  'VALIDATION_ERROR': 'VALIDATION_ERROR',
  'AUTH_ERROR': 'AUTH_ERROR',
  'FORBIDDEN_ERROR': 'FORBIDDEN_ERROR',
};

enum STATUSES {
  NOT_FOUND = 404,
  VALIDATION_ERROR = 400,
  AUTH_ERROR = 401,
  FORBIDDEN_ERROR = 403,
}

type ArrayErrors = { message: string, field: string }

export class CustomError extends Error {
  status: string
  arrayErrors: ArrayErrors[]

  constructor(status: string, message: string, arrayErrors: ArrayErrors[]) {
    super();
    this.status = status
    this.message = message;
    this.arrayErrors = arrayErrors;
  }
}

export const sendError = (error: any, res: Response) => {
  if(error instanceof CustomError) {
    const status = STATUSES[error.status as keyof typeof STATUSES];
    res.status(status).json(error.arrayErrors.length
      ? {errorsMessages: [...error.arrayErrors] }
      : error.message);
    return
  }

  res.status(HTTP_STATUS_CODE.SERVER_ERROR_500).json(error.message);
};