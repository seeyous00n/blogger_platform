import { NextFunction, Request, Response } from 'express';
import { HTTP_MESSAGE, HTTP_STATUS_CODE, SETTINGS } from '../settings';

export const BASIC = 'Basic';

const auth = `${SETTINGS.auth.name}:${SETTINGS.auth.password}`;
export const convertToBase64 = () => Buffer.from(auth).toString('base64');

export const authValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(HTTP_STATUS_CODE.UNAUTHORIZED_401).json(HTTP_MESSAGE.UNAUTHORIZED);
    return;
  }

  const authorization = authHeader.split(' ');
  const auth = convertToBase64();

  if (auth !== authorization[1] || authorization[0] !== BASIC) {
    res.status(HTTP_STATUS_CODE.UNAUTHORIZED_401).json(HTTP_MESSAGE.UNAUTHORIZED);
    return;
  }

  next();
};