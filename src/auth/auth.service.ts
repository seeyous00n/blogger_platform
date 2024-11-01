import { AuthType } from './types/auth.type';
import { authRepository } from './auth.repository';
import { AuthError, NotFoundError, ValidationError } from '../common/errorHandler';
import bcrypt from 'bcrypt';
import { sendEmail } from '../common/adapters/nodemailer.service';
import { SETTINGS } from '../common/settings';
import { userRepository } from '../users/users.repository';
import { ERROR_MESSAGE } from '../common/types/types';
import { v4 as uuidv4 } from 'uuid';

const ERROR_LOGIN_MESSAGE = 'Error email/login';

class AuthService {
  async checkCredentials(data: AuthType) {
    const result = await authRepository.findByLoginOrEmail(data);

    if (!result) throw new AuthError(ERROR_LOGIN_MESSAGE);

    const isAuth = await bcrypt.compare(data.password, result.passwordHash);
    if (!isAuth) {
      throw new AuthError(ERROR_LOGIN_MESSAGE);
    }

    return { userId: result._id.toString() };
  }

  async registration(email: string, code: string) {
    const link = `${SETTINGS.API_URL}?code=${code}`;
    await sendEmail(email, link);
  }

  async confirmation(code: string) {
    const userData = await userRepository.findByConfirmationCode(code);

    if (!userData) throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND);
    if (userData.emailConfirmation.isConfirmed) throw new ValidationError('email is confirmed/incorrect', 'email');
    if (userData.emailConfirmation.expirationDate < new Date()) {
      throw new ValidationError('expiration code', 'code');
    }

    await userRepository.updateIsConfirmed(userData.emailConfirmation.confirmationCode);
  }

  async resending(email: string) {
    const userData = await userRepository.findByEmail(email);
    if (!userData) throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND);
    if (userData.emailConfirmation.isConfirmed) throw new ValidationError('email is confirmed/incorrect', 'email');

    const newCode = uuidv4();
    await userRepository.updateConfirmationCode(userData.emailConfirmation.confirmationCode, newCode);
    await this.registration(email, newCode);
  }
}

export const authService = new AuthService();