import { NextFunction, Request, Response } from 'express';
import { HTTP_MESSAGE, HTTP_STATUS_CODE, SETTINGS } from '../../settings';
import { RequestBase } from "../../types/types";

export const BASIC = 'Basic';

const auth = `${SETTINGS.auth.name}:${SETTINGS.auth.password}`;
export const convertToBase64 = () => Buffer.from(auth).toString('base64');

export const authBaseGuard = (req: RequestBase, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(HTTP_STATUS_CODE.UNAUTHORIZED_401).json(HTTP_MESSAGE.UNAUTHORIZED);
    return;
  }

  const [type, hash] = authHeader.split(' ');
  const auth = convertToBase64();

  if (type !== BASIC || auth !== hash) {
    res.status(HTTP_STATUS_CODE.UNAUTHORIZED_401).json(HTTP_MESSAGE.UNAUTHORIZED);
    return;
  }

  next();
};