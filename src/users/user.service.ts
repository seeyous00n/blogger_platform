import { UserCreateModel } from './models/userCreate.model';
import { UserEntityType } from './types/user.types';
import { userRepository } from './users.repository';
import { CustomError, TYPE_ERROR } from '../common/errorHandler';
import { generatePasswordHash } from '../common/adapters/bcrypt.service';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { UserCreateInputModel } from './models/userCreateInput.model';
import { InsertOneResult, WithId } from 'mongodb';

class UserService {
  async getUserById(id: string): Promise<WithId<UserEntityType>> {
    const result = await userRepository.findById(id);
    if (!result) {
      throw new CustomError(TYPE_ERROR.NOT_FOUND);
    }

    return result;
  }

  async createUser(data: UserCreateInputModel, confirmed: boolean = true): Promise<InsertOneResult<UserEntityType>> {
    await this.uniqueEmailAndLoginOrError(data);
    const hash = await generatePasswordHash(data.password);

    const newUser: UserEntityType = {
      login: data.login,
      email: data.email,
      passwordHash: hash,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: uuidv4(),
        isConfirmed: confirmed,
        expirationDate: add(new Date(), { hours: 1 }),
      },
    };

    return await userRepository.create(newUser);
  }

  async deleteUserById(id: string): Promise<void> {
    await this.existsUserOrError(id);
    await userRepository.deleteById(id);
  }

  async existsUserOrError(id: string): Promise<void> {
    const result = await userRepository.findById(id);
    if (!result) {
      throw new CustomError(TYPE_ERROR.NOT_FOUND);
    }
  }

  async uniqueEmailAndLoginOrError(data: UserCreateModel): Promise<void> {
    const userData = await userRepository.getUserByEmailOrLogin(data);
    if (userData.email) {
      const errorMessage = 'email and login should be unique';
      throw new CustomError(TYPE_ERROR.VALIDATION_ERROR, [{ message: errorMessage, field: 'email' }]);
    }
    if (userData.login) {
      const errorMessage = 'login and login should be unique';
      throw new CustomError(TYPE_ERROR.VALIDATION_ERROR, [{ message: errorMessage, field: 'login' }]);
    }
  }
}

export const userService = new UserService();