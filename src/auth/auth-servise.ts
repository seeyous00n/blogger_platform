import { AuthType } from './types/auth-type';
import { authRepository } from './auth-repository';
import { AuthError } from '../common/errorHandler';
import bcrypt from 'bcrypt';

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
}

export const authService = new AuthService();