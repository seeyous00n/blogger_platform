import jwt from 'jsonwebtoken';
import { SETTINGS } from '../settings';
import { JWTPayloadType } from '../types/jwt-types';

const JWT_SECRET = <jwt.Secret>SETTINGS.JWT_TOKEN;

class TokenService {
  async generateToken(payload: JWTPayloadType) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '50min' });
  }

  async validateToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return;
    }
  }
}

export const tokenService = new TokenService();