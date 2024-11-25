import { UserCreateModel } from './models/userCreate.model';
import { userRepository } from './users.repository';
import { CustomError, TYPE_ERROR } from '../common/errorHandler';
import { generatePasswordHash } from '../common/adapters/bcrypt.service';
import { UserCreateInputModel } from './models/userCreateInput.model';
import { ObjectId } from 'mongodb';
import { ERROR } from "../auth/types/auth.type";
import { UserCreateDto } from "./dto/userCreate.dto";
import { UserDocument } from "../common/db/schemes/userSchema";

class UserService {
  async createUser(data: UserCreateInputModel): Promise<UserDocument> {
    await this.checkUniqueEmailAndLogin(data);
    const hash = await generatePasswordHash(data.password);

    const newUser = new UserCreateDto({ login: data.login, email: data.email, hash });
    return await userRepository.create(newUser);
  }

  async deleteUserById(id: string): Promise<void> {
    await this.checkExistsUser(id);
    await userRepository.deleteById(id);
  }

  async checkExistsUser(id: string): Promise<void> {
    const result = await userRepository.findById(id);
    if (!result) {
      throw new CustomError(TYPE_ERROR.NOT_FOUND);
    }
  }

  async updateIsConfirmed(id: ObjectId): Promise<void> {
    await userRepository.updateIsConfirmed(id);
  }

  async checkUniqueEmailAndLogin(data: UserCreateModel): Promise<void> {
    const userData = await userRepository.getUserByEmailOrLogin(data);
    if (userData && userData.email === data.email) {
      throw new CustomError(TYPE_ERROR.VALIDATION_ERROR, [{
        message: ERROR.MESSAGE.UNIQUE_EMAIL_AND_LOGIN,
        field: ERROR.FIELD.EMAIL
      }]);
    }
    if (userData && userData.login === data.login) {
      throw new CustomError(TYPE_ERROR.VALIDATION_ERROR, [{
        message: ERROR.MESSAGE.UNIQUE_EMAIL_AND_LOGIN,
        field: ERROR.FIELD.LOGIN
      }]);
    }
  }
}

export const userService = new UserService();