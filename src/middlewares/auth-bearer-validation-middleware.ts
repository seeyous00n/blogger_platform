import { NextFunction, Request, Response } from 'express';
import { HTTP_MESSAGE, HTTP_STATUS_CODE } from '../settings';
import { tokenService } from '../services/token-service';

export const BEARER = 'Bearer';

export const authBearerValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(HTTP_STATUS_CODE.UNAUTHORIZED_401).json(HTTP_MESSAGE.UNAUTHORIZED);
    return;
  }

  const [type, token] = authHeader.split(' ');

  if (type !== BEARER) {
    res.status(HTTP_STATUS_CODE.UNAUTHORIZED_401).json(HTTP_MESSAGE.UNAUTHORIZED);
    return;
  }

  const payload = await tokenService.validateToken(token);

  if (!payload) {
    res.status(HTTP_STATUS_CODE.UNAUTHORIZED_401).json(HTTP_MESSAGE.UNAUTHORIZED);
    return;
  }

  req.body.userId = payload.userId;

  next();
};