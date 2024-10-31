import { UserCreateModel } from './models/userCreate.model';
import { UserEntityType } from './types/user.types';
import { userRepository } from './users.repository';
import { NotFoundError, ValidationError } from '../common/errorHandler';
import { ERROR_MESSAGE } from '../common/types/types';
import { generatePasswordHash } from '../common/adapters/bcrypt.service';

class UserService {
  async createUser(data: UserCreateModel) {
    await this.isUniqueEmailAndLogin(data);
    const hash = await generatePasswordHash(data.password);

    const newUser: UserEntityType = {
      ...data,
      passwordHash: hash,
      createdAt: new Date().toISOString(),
    };

    return await userRepository.create(newUser);
  }

  async deleteUserById(id: string) {
    await this.isExistsUser(id);
    await userRepository.deleteById(id);
  }

  async isExistsUser(id: string) {
    const result = await userRepository.findById(id);
    if (!result) {
      throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND);
    }

    return result;
  }

  async isUniqueEmailAndLogin(data: UserCreateModel) {
    const userData = await userRepository.getUserByEmailOrLogin(data);

    if (userData.email || userData.login) {
      throw new ValidationError('email and login should be unique', 'email or login');
    }
  }
}

export const userService = new UserService();