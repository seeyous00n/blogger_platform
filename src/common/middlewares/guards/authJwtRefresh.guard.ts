import { NextFunction, Request, Response } from 'express';
import { HTTP_MESSAGE, HTTP_STATUS_CODE } from '../../settings';
import { tokenService } from '../../services/token.service';

export const authJwtRefreshGuard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(HTTP_STATUS_CODE.UNAUTHORIZED_401).json(HTTP_MESSAGE.UNAUTHORIZED);
    return;
  }

  const token = tokenService.validateRefreshToken(refreshToken);
  if(!token) {
    res.status(HTTP_STATUS_CODE.UNAUTHORIZED_401).json(HTTP_MESSAGE.UNAUTHORIZED);
    return;
  }

  req.body.userId = token.userId;

  next();
};