import jwt from 'jsonwebtoken';
import { SETTINGS } from '../settings';
import { JWTPayloadAccessType, JWTPayloadRefreshType } from '../types/jwt.types';
import { CustomError, TYPE_ERROR } from "../errorHandler";

const JWT_SECRET = <jwt.Secret>SETTINGS.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = <jwt.Secret>SETTINGS.JWT_REFRESH_SECRET;
const ACCESS_EXP = '10sec';
const REFRESH_EXP = '20sec';

class TokenService {
  generateTokens(payload: JWTPayloadRefreshType) {
    const accessToken = jwt.sign({ userId: payload.userId }, JWT_SECRET, { expiresIn: ACCESS_EXP });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXP });

    const { iat, exp } = this.getDataToken(refreshToken);
    return { accessToken, refreshToken, iat, exp };
  }

  validateAccessToken(token: string): JWTPayloadAccessType | undefined {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayloadAccessType;
    } catch (error) {
      return;
    }
  }

  validateRefreshToken(token: string): JWTPayloadRefreshType | undefined {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayloadRefreshType;
    } catch (error) {
      return;
    }
  }

  getDataToken(token: string) {
    const result = jwt.decode(token) as JWTPayloadRefreshType & { iat: number, exp: number };
    if (!result) throw new CustomError(TYPE_ERROR.AUTH_ERROR);

    return { userId: result.userId, deviceId: result.deviceId, iat: result.iat, exp: result.exp };
  }
}

export const tokenService = new TokenService();