import { NextFunction, Request, Response } from 'express';
import { HTTP_MESSAGE, HTTP_STATUS_CODE } from '../settings';

export const authValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const LOG = 'admin';
  const PASS = 'qwerty';
  const BASIC = 'Basic';

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(HTTP_STATUS_CODE.UNAUTHORIZED_401).json(HTTP_MESSAGE.UNAUTHORIZED);
  }

  if (authHeader) {
    const authorization = authHeader.split(' ');
    const decodedData = Buffer.from(authorization[1], 'base64').toString('utf-8').split(':');
    if (decodedData[0] !== LOG || decodedData[1] !== PASS || authorization[0] !== BASIC) {
      res.status(HTTP_STATUS_CODE.UNAUTHORIZED_401).json(HTTP_MESSAGE.UNAUTHORIZED);
    }
  }

  next();
};