import { AuthType, ERROR, TYPE_EMAIL } from './types/auth.type';
import { CustomError, TYPE_ERROR } from '../common/errorHandler';
import bcrypt from 'bcrypt';
import { nodemailerService } from '../common/adapters/nodemailer.service';
import { SETTINGS } from '../common/settings';
import { userRepository } from '../users/users.repository';
import { v4 as uuidv4 } from 'uuid';
import { tokenService } from "../common/services/token.service";
import { JWTPayloadType } from "../common/types/jwt.types";
import { authRepository } from "./auth.repository";
import { WithId } from "mongodb";
import { PairTokensType, TokenEntityType } from "./types/token.type";

class AuthService {
  async checkCredentials(data: AuthType): Promise<{ userId: string }> {
    const result = await userRepository.findByLoginOrEmail(data);
    if (!result) throw new CustomError(TYPE_ERROR.AUTH_ERROR);

    const isAuth = await bcrypt.compare(data.password, result.passwordHash);
    if (!isAuth) throw new CustomError(TYPE_ERROR.AUTH_ERROR);

    return { userId: result._id.toString() };
  }

  async registration(email: string, code: string): Promise<void> {
    const link = `${SETTINGS.API_URL}?code=${code}`;
    await nodemailerService.sendEmail(email, link);
    // nodemailerService.sendEmail(email, link).catch((error) => {});
  }

  async confirmation(code: string): Promise<void> {
    const userData = await userRepository.findByConfirmationCode(code);

    if (!userData) {
      throw new CustomError(TYPE_ERROR.VALIDATION_ERROR, [{
        message: ERROR.MESSAGE.INCORRECT_CODE,
        field: ERROR.FIELD.CODE
      }]);
    }

    if (userData.emailConfirmation.isConfirmed) {
      throw new CustomError(TYPE_ERROR.VALIDATION_ERROR, [{
        message: ERROR.MESSAGE.IS_CONFIRMED,
        field: ERROR.FIELD.CODE
      }]);
    }

    if (userData.emailConfirmation.expirationDate < new Date()) {
      throw new CustomError(TYPE_ERROR.VALIDATION_ERROR, [{
        message: ERROR.MESSAGE.EXPIRATION_CODE,
        field: ERROR.FIELD.EMAIL,
      }]);
    }

    await userRepository.updateIsConfirmed(userData._id);
  }

  async resending(email: string): Promise<void> {
    const userData = await userRepository.findByEmail(email);
    if (!userData) {
      throw new CustomError(TYPE_ERROR.VALIDATION_ERROR, [{
        message: ERROR.MESSAGE.EMAIL_NOT_FOUND,
        field: ERROR.FIELD.EMAIL,
      }]);
    }

    if (userData.emailConfirmation.isConfirmed) {
      throw new CustomError(TYPE_ERROR.VALIDATION_ERROR, [{
        message: ERROR.MESSAGE.EMAIL_CONFIRMED,
        field: ERROR.FIELD.EMAIL,
      }]);
    }

    const newCode = uuidv4();
    await userRepository.updateConfirmationCode(userData._id, newCode);
    const link = `${SETTINGS.API_URL}?code=${newCode}`;
    await nodemailerService.sendEmail(email, link, TYPE_EMAIL.RESEND_CODE);
  }

  async createTokens(payload: JWTPayloadType): Promise<PairTokensType> {
    const tokens = tokenService.generateTokens(payload);
    const tokenData = { tokenIat: tokens.iat, userId: payload.userId };
    await authRepository.createByData(tokenData);

    return tokens;
  }

  async getNewPairOfTokens(token: string): Promise<PairTokensType> {
    const { userId, iat } = tokenService.getDataToken(token);
    const result = await this.findTokenByIat(iat, userId);
    const tokens = tokenService.generateTokens({ userId });
    await authRepository.updateTokenById(result._id, tokens.iat);

    return tokens;
  }

  async deleteToken(token: number, userId: string): Promise<void> {
    const result = await this.findTokenByIat(token, userId);
    await authRepository.deleteById(result._id);
  }

  async findTokenByIat(token: number, userId: string): Promise<WithId<TokenEntityType>> {
    const result = await authRepository.findByIat(token, userId);
    if (!result) {
      throw new CustomError(TYPE_ERROR.AUTH_ERROR);
    }

    return result;
  }
}

export const authService = new AuthService();