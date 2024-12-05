import { NextFunction, Request, Response } from 'express';
import { HTTP_MESSAGE, HTTP_STATUS_CODE } from '../../settings';
import { TokenService } from "../../services/token.service";
import { container } from "../../../composition-root";
import { AuthService } from "../../../auth/auth.service";
import { AuthRepository } from "../../../auth/auth.repository";

export const authJwtRefreshGuard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(HTTP_STATUS_CODE.UNAUTHORIZED_401).json(HTTP_MESSAGE.UNAUTHORIZED);
    return;
  }

  const tokenService = container.resolve(TokenService);
  const token = tokenService.validateRefreshToken(refreshToken);

  if (!token) {
    res.status(HTTP_STATUS_CODE.UNAUTHORIZED_401).json(HTTP_MESSAGE.UNAUTHORIZED);
    return;
  }

  const { iat, deviceId } = tokenService.getDataToken(refreshToken);
  const authRepository = container.resolve(AuthRepository);
  const result = await authRepository.findSessionByIat(iat, deviceId);

  if (!result) {
    res.status(HTTP_STATUS_CODE.UNAUTHORIZED_401).json(HTTP_MESSAGE.UNAUTHORIZED);
    return;
  }

  next();
};