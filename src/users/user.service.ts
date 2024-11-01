import { UserCreateModel } from './models/userCreate.model';
import { UserEntityType } from './types/user.types';
import { userRepository } from './users.repository';
import { NotFoundError, ValidationError } from '../common/errorHandler';
import { ERROR_MESSAGE } from '../common/types/types';
import { generatePasswordHash } from '../common/adapters/bcrypt.service';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { UserCreateInputModel } from './models/userCreateInputModel';

class UserService {
  async createUser(data: UserCreateInputModel, registration: boolean = true) {
    await this.isUniqueEmailAndLogin(data);
    const hash = await generatePasswordHash(data.password);

    const newUser: UserEntityType = {
      login: data.login,
      email: data.email,
      passwordHash: hash,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: uuidv4(),
        isConfirmed: registration,
        expirationDate: add(new Date(), { hours: 1 }),
      },
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
    if (userData.email) {
      throw new ValidationError('email and login should be unique', 'email');
    }
    if (userData.login) {
      throw new ValidationError('login and login should be unique', 'login');
    }
  }
}

export const userService = new UserService();