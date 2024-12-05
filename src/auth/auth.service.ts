import { AuthType, ERROR, TYPE_EMAIL } from './types/auth.type';
import { CustomError, TYPE_ERROR } from '../common/errorHandler';
import { NodemailerService } from '../common/adapters/nodemailer.service';
import { TokenService } from "../common/services/token.service";
import { WithId } from "mongodb";
import { CreateTokensType, PairTokensType, SessionType } from "./types/token.type";
import { compareHash, generatePasswordHash } from "../common/adapters/bcrypt.service";
import { SessionCreateDto } from "./dto/sessionCreate.dto";
import { getUrlUtil } from "../common/utils/getUrl.util";
import { RecoveryUpdateDto } from "./dto/recoveryUpdate.dto";
import { createUuid } from "../common/utils/createUuid.util";
import { AuthRepository } from "./auth.repository";
import { UserRepository } from "../users/users.repository";
import { inject, injectable } from "inversify";

@injectable()
export class AuthService {
  constructor(
    @inject(AuthRepository) private authRepository: AuthRepository,
    @inject(UserRepository) private userRepository: UserRepository,
    @inject(NodemailerService) private nodemailerService: NodemailerService,
    @inject(TokenService) private tokenService: TokenService) {
  }

  async checkCredentials(data: AuthType): Promise<string> {
    const result = await this.userRepository.findByLoginOrEmail(data);
    if (!result) throw new CustomError(TYPE_ERROR.AUTH_ERROR);

    const isAuth = await compareHash(data.password, result.password.hash);
    if (!isAuth) throw new CustomError(TYPE_ERROR.AUTH_ERROR);

    return result._id.toString();
  }

  async registration(email: string, code: string): Promise<void> {
    const link = getUrlUtil.registrationConfirmation(code);
    this.nodemailerService.sendEmail(email, link).catch();
  }

  async confirmation(code: string): Promise<void> {
    const userData = await this.userRepository.findByConfirmationCode(code);

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

    await this.userRepository.updateIsConfirmed(userData._id);
  }

  async resending(email: string): Promise<void> {
    const userData = await this.userRepository.findByEmail(email);
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

    const newCode = createUuid();
    await this.userRepository.updateConfirmationCode(userData._id, newCode);
    const link = getUrlUtil.registrationConfirmation(newCode);
    this.nodemailerService.sendEmail(email, link, TYPE_EMAIL.RESEND_CODE).catch();
  }

  async createTokens(data: CreateTokensType): Promise<PairTokensType> {
    const deviceId = createUuid();
    const payload = { deviceId, userId: data.userId };
    const tokens = this.tokenService.generateTokens(payload);

    const newData = new SessionCreateDto({ ...data, deviceId, tokenIat: tokens.iat, tokenExp: tokens.exp });
    await this.authRepository.createSessionByData(newData);

    return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
  }

  async refreshToken(token: string): Promise<PairTokensType> {
    const { userId, deviceId, iat } = this.tokenService.getDataToken(token);
    const result = await this.findTokenByIat(iat, deviceId);
    const tokens = this.tokenService.generateTokens({ userId, deviceId });

    const data = { tokenIat: tokens.iat, tokenExp: tokens.exp, lastActiveDate: new Date(tokens.iat * 1000) };
    await this.authRepository.updateSessionById(result._id, data);

    return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
  }

  async deleteToken(token: number, deviceId: string): Promise<void> {
    const result = await this.findTokenByIat(token, deviceId);
    await this.authRepository.deleteSessionById(result._id);
  }

  async findTokenByIat(token: number, deviceId: string): Promise<WithId<SessionType>> {
    const result = await this.authRepository.findSessionByIat(token, deviceId);
    if (!result) {
      throw new CustomError(TYPE_ERROR.AUTH_ERROR);
    }

    return result;
  }

  async recovery(email: string): Promise<void> {
    const result = await this.userRepository.findByEmail(email);
    if (!result) {
      return;
    }

    const data = new RecoveryUpdateDto({ id: result._id });
    const link = getUrlUtil.passwordRecovery(data.code);

    await this.userRepository.updateRecoveryCode(data);
    this.nodemailerService.sendEmail(email, link, TYPE_EMAIL.RECOVERY_CODE).catch();
  }

  async newPassword(code: string, password: string): Promise<void> {
    const userData = await this.userRepository.findByRecoveryCode(code);
    if (!userData) {
      throw new CustomError(TYPE_ERROR.VALIDATION_ERROR, [{
        message: ERROR.MESSAGE.INCORRECT_RECOVERY_CODE,
        field: ERROR.FIELD.RECOVERY_CODE,
      }]);
    }

    if (userData.password.expirationDate && userData.password.expirationDate < new Date()) {
      throw new CustomError(TYPE_ERROR.VALIDATION_ERROR, [{
        message: ERROR.MESSAGE.EXPIRATION_RECOVERY_CODE,
        field: ERROR.FIELD.RECOVERY_CODE,
      }]);
    }

    const data = {
      id: userData._id,
      hash: await generatePasswordHash(password),
    };

    await this.userRepository.updatePassword(data);
  }
}