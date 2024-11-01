import { AuthType } from './types/auth.type';
import { authRepository } from './auth.repository';
import { AuthError, CustomError, TYPE_ERROR, ValidationError } from '../common/errorHandler';
import bcrypt from 'bcrypt';
import { nodemailerService } from '../common/adapters/nodemailer.service';
import { SETTINGS } from '../common/settings';
import { userRepository } from '../users/users.repository';
import { v4 as uuidv4 } from 'uuid';

const ERROR_LOGIN_MESSAGE = 'Error email/login';
const ERROR_IS_CONFIRMED = 'code confirmed';
const ERROR_EXPIRATION_CODE = 'Error email/login';
const ERROR_EMAIL_NOT_FOUND = 'email not found';
const ERROR_EMAIL_CONFIRMED = 'email is confirmed';
const ERROR_INCORRECT_CODE = 'incorrect code';

class AuthService {
  async checkCredentials(data: AuthType) {
    const result = await authRepository.findByLoginOrEmail(data);

    //if (!result) throw new AuthError(ERROR_LOGIN_MESSAGE);
    if (!result) throw new CustomError(TYPE_ERROR.AUTH_ERROR, ERROR_LOGIN_MESSAGE, []);

    const isAuth = await bcrypt.compare(data.password, result.passwordHash);
    if (!isAuth) {
      //throw new AuthError(ERROR_LOGIN_MESSAGE);
      throw new CustomError(TYPE_ERROR.AUTH_ERROR, ERROR_LOGIN_MESSAGE, []);
    }

    return { userId: result._id.toString() };
  }

  async registration(email: string, code: string) {
    const link = `${SETTINGS.API_URL}?code=${code}`;
    await nodemailerService.sendEmail(email, link);
  }

  async confirmation(code: string) {
    const userData = await userRepository.findByConfirmationCode(code);

    //if (!userData) throw new ValidationError('incorrect code', 'code');
    if (!userData) throw new CustomError(TYPE_ERROR.VALIDATION_ERROR, ERROR_INCORRECT_CODE, [{ message: ERROR_INCORRECT_CODE, field: 'code' }]);
    //if (userData.emailConfirmation.isConfirmed) throw new ValidationError('email is confirmed/incorrect', 'code');
    if (userData.emailConfirmation.isConfirmed) throw new CustomError(TYPE_ERROR.VALIDATION_ERROR, ERROR_IS_CONFIRMED, [{ message: ERROR_IS_CONFIRMED, field: 'code' }]);
    if (userData.emailConfirmation.expirationDate < new Date()) {
      //throw new ValidationError('expiration code', 'code');
      throw new CustomError(TYPE_ERROR.VALIDATION_ERROR, ERROR_EXPIRATION_CODE, [{ message: ERROR_EXPIRATION_CODE, field: 'code' }]);
    }

    await userRepository.updateIsConfirmed(userData.emailConfirmation.confirmationCode);
  }

  async resending(email: string) {
    const userData = await userRepository.findByEmail(email);
    //if (!userData) throw new ValidationError('email not found', 'email');
    if (!userData) throw new CustomError(TYPE_ERROR.VALIDATION_ERROR, ERROR_EMAIL_NOT_FOUND, [{
      message: ERROR_EMAIL_NOT_FOUND,
      field: 'email',
    }]);
    //if (userData.emailConfirmation.isConfirmed) throw new ValidationError('email is confirmed', 'email');
    if (userData.emailConfirmation.isConfirmed) throw new CustomError(TYPE_ERROR.VALIDATION_ERROR, ERROR_EMAIL_CONFIRMED, [{
      message: ERROR_EMAIL_CONFIRMED,
      field: 'email',
    }]);

    const newCode = uuidv4();
    await userRepository.updateConfirmationCode(userData.emailConfirmation.confirmationCode, newCode);
    await this.registration(email, newCode);
  }
}

export const authService = new AuthService();