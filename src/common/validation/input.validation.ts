import { NextFunction, Request, Response } from 'express';
import { Result, validationResult } from 'express-validator';
import { resultErrorsType } from '../types/types';
import { HTTP_STATUS_CODE } from '../settings';

export const inputValidation = (req: Request, res: Response, next: NextFunction): void => {
  const errors: Result = validationResult(req);
  if (!errors.isEmpty()) {
    const resultErrors: resultErrorsType = {
      errorsMessages: [],
    };

    resultErrors.errorsMessages = errors.array({ onlyFirstError: true })
      .map((error) => ({ message: error.msg, field: error.path }));

    res.status(HTTP_STATUS_CODE.BAD_REQUEST_400).json(resultErrors);
    return;
  }

  next();
};