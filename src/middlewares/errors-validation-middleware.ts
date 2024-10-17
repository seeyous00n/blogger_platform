import { NextFunction, Request, Response } from 'express';
import { Result, validationResult } from 'express-validator';
import { resultErrorsType } from '../types/types';

export const errorsValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors: Result = validationResult(req);
  if (!errors.isEmpty()) {
    const resultErrors: resultErrorsType = {
      errorsMessages: [],
    };

    resultErrors.errorsMessages = errors.array({ onlyFirstError: true })
      .map((error) => ({ message: error.msg, field: error.path }));

    res.status(400).json(resultErrors);
    return;
  }
  next();
};