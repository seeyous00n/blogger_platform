import bcrypt from 'bcrypt';
import { AuthType } from '../types/auth-type';
import { authRepository } from '../repositories/auth-repository';
import { AuthError } from '../utils/error-handler';

const ERROR_LOGIN_MESSAGE = 'Error email/login';

class AuthService {
  async checkCredentials(data: AuthType) {
    const result = await authRepository.findByLoginOrEmail(data);

    if (!result) throw new AuthError(ERROR_LOGIN_MESSAGE);

    if (result) {
      const hash = await bcrypt.hash(data.password, result.salt);
      if (hash !== result.password) {
        throw new AuthError(ERROR_LOGIN_MESSAGE);
      }
    }
  }
}

export const authService = new AuthService();