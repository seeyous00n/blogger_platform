import { NextFunction, Response } from 'express';
import { HTTP_STATUS_CODE } from './settings';

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
  arrayErrors?: ArrayErrors[] | undefined;

  constructor(message: string, arrayErrors?: ArrayErrors[] | undefined) {
    super(message);
    this.message = message;
    this.arrayErrors = arrayErrors;
  }
}

export const sendError = (error: Error | CustomError, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof CustomError) {
    const status = STATUSES[error.message as keyof typeof STATUSES];
    const isArrayErrors = !!(error.arrayErrors && error.arrayErrors.length);

    res.status(status).json(isArrayErrors ? { errorsMessages: [...error.arrayErrors!] } : error.message);
    return;
  }

  res.status(HTTP_STATUS_CODE.SERVER_ERROR_500).json(error.message);
  next();
};