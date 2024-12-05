import { NextFunction, Request, Response } from 'express';
import { HTTP_MESSAGE, HTTP_STATUS_CODE } from '../../settings';
import { TokenService } from "../../services/token.service";
import { container } from "../../../composition-root";

export const BEARER = 'Bearer';

export const authJwtGuard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

  const tokenService = container.resolve(TokenService);
  const payload = tokenService.validateAccessToken(token);

  if (!payload) {
    res.status(HTTP_STATUS_CODE.UNAUTHORIZED_401).json(HTTP_MESSAGE.UNAUTHORIZED);
    return;
  }

  req.user = payload;

  next();
};