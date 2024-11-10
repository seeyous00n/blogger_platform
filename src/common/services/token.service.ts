import jwt from 'jsonwebtoken';
import { SETTINGS } from '../settings';
import { JWTPayloadType } from '../types/jwt.types';
import { CustomError, TYPE_ERROR } from "../errorHandler";

const JWT_SECRET = <jwt.Secret>SETTINGS.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = <jwt.Secret>SETTINGS.JWT_REFRESH_SECRET;
const ACCESS_EXP = '10sec';
const REFRESH_EXP = '20sec';

class TokenService {
  generateTokens(payload: JWTPayloadType) {
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXP });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXP });
    const { iat } = this.getDataToken(refreshToken);
    return { accessToken, refreshToken, iat };
  }

  validateAccessToken(token: string): JWTPayloadType | undefined {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayloadType;
    } catch (error) {
      return;
    }
  }

  validateRefreshToken(token: string): JWTPayloadType | undefined {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayloadType;
    } catch (error) {
      return;
    }
  }

  getDataToken(token: string) {
    const result = jwt.decode(token) as JWTPayloadType & { iat: number };
    if (!result) throw new CustomError(TYPE_ERROR.AUTH_ERROR);

    return { userId: result.userId, iat: result.iat };
  }
}

export const tokenService = new TokenService();