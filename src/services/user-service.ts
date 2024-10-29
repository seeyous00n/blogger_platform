import { UserCreateModel } from '../models/user/UserCreateModel';
import { ObjectId } from 'mongodb';
import { UserType } from '../types/user-types';
import { userRepository } from '../repositories/users-repository';
import { NotFoundError, ValidationError } from '../utils/error-handler';
import { ERROR_MESSAGE } from '../types/types';
import { generatePasswordHash } from '../utils/utils';

class UserService {
  async createUser(data: UserCreateModel) {
    await this.isUniqueEmailAndLogin(data);
    const hash = await generatePasswordHash(data.password);

    const newUser: UserType = {
      ...data,
      passwordHash: hash,
      _id: new ObjectId(),
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