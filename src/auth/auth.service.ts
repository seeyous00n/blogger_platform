import { AuthType, ERROR, TYPE_EMAIL } from './types/auth.type';
import { CustomError, TYPE_ERROR } from '../common/errorHandler';
import bcrypt from 'bcrypt';
import { nodemailerService } from '../common/adapters/nodemailer.service';
import { SETTINGS } from '../common/settings';
import { userRepository } from '../users/users.repository';
import { v4 as uuidv4 } from 'uuid';

class AuthService {
  async checkCredentials(data: AuthType): Promise<{ userId: string }> {
    //TODO это норм кандидат для чека в middleware???
    const result = await userRepository.findByLoginOrEmail(data);

    if (!result) throw new CustomError(TYPE_ERROR.AUTH_ERROR, ERROR.MESSAGE.LOGIN);

    const isAuth = await bcrypt.compare(data.password, result.passwordHash);
    if (!isAuth) {
      throw new CustomError(TYPE_ERROR.AUTH_ERROR, ERROR.MESSAGE.LOGIN);
    }

    return { userId: result._id.toString() };
  }

  async registration(email: string, code: string): Promise<void> {
    const link = `${SETTINGS.API_URL}?code=${code}`;
    await nodemailerService.sendEmail(email, link);
    // nodemailerService.sendEmail(email, link).catch((error) => {});
  }

  async confirmation(code: string): Promise<void> {
    const userData = await userRepository.findByConfirmationCode(code);

    if (!userData) throw new CustomError(TYPE_ERROR.VALIDATION_ERROR, ERROR.MESSAGE.INCORRECT_CODE, [{
      message: ERROR.MESSAGE.INCORRECT_CODE,
      field: ERROR.FIELD.CODE,
    }]);
    if (userData.emailConfirmation.isConfirmed) throw new CustomError(TYPE_ERROR.VALIDATION_ERROR, ERROR.MESSAGE.IS_CONFIRMED, [{
      message: ERROR.MESSAGE.IS_CONFIRMED,
      field: ERROR.FIELD.CODE,
    }]);
    if (userData.emailConfirmation.expirationDate < new Date()) {
      throw new CustomError(TYPE_ERROR.VALIDATION_ERROR, ERROR.MESSAGE.EXPIRATION_CODE, [{
        message: ERROR.MESSAGE.EXPIRATION_CODE,
        field: ERROR.FIELD.EMAIL,
      }]);
    }

    await userRepository.updateIsConfirmed(userData.emailConfirmation.confirmationCode);
  }

  async resending(email: string): Promise<void> {
    const userData = await userRepository.findByEmail(email);
    if (!userData) throw new CustomError(TYPE_ERROR.VALIDATION_ERROR, ERROR.MESSAGE.EMAIL_NOT_FOUND, [{
      message: ERROR.MESSAGE.EMAIL_NOT_FOUND,
      field: ERROR.FIELD.EMAIL,
    }]);
    if (userData.emailConfirmation.isConfirmed) throw new CustomError(TYPE_ERROR.VALIDATION_ERROR, ERROR.MESSAGE.EMAIL_CONFIRMED, [{
      message: ERROR.MESSAGE.EMAIL_CONFIRMED,
      field: ERROR.FIELD.EMAIL,
    }]);

    const newCode = uuidv4();
    await userRepository.updateConfirmationCode(userData.emailConfirmation.confirmationCode, newCode);
    const link = `${SETTINGS.API_URL}?code=${newCode}`;
    await nodemailerService.sendEmail(email, link, TYPE_EMAIL.RESEND_CODE);
  }
}

export const authService = new AuthService();