import { AuthType } from './types/auth-type';
import { usersCollection } from '../db';

class AuthRepository {
  async findByLoginOrEmail(data: AuthType) {
    return await usersCollection.findOne({ $or: [{ email: data.loginOrEmail }, { login: data.loginOrEmail }] });
  }
}

export const authRepository = new AuthRepository();
