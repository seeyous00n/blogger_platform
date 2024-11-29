import { UserCreateModel } from './models/userCreate.model';
import { UserRepository } from './users.repository';
import { CustomError, TYPE_ERROR } from '../common/errorHandler';
import { generatePasswordHash } from '../common/adapters/bcrypt.service';
import { UserCreateInputModel } from './models/userCreateInput.model';
import { ObjectId } from 'mongodb';
import { ERROR } from "../auth/types/auth.type";
import { UserCreateDto } from "./dto/userCreate.dto";
import { UserDocument } from "../common/db/schemes/userSchema";

export class UserService {
  constructor(private userRepository: UserRepository) {
  }

  async createUser(data: UserCreateInputModel): Promise<UserDocument> {
    await this.checkUniqueEmailAndLogin(data);
    const hash = await generatePasswordHash(data.password);

    const newUser = new UserCreateDto({ login: data.login, email: data.email, hash });
    return await this.userRepository.create(newUser);
  }

  async deleteUserById(id: string): Promise<void> {
    await this.checkExistsUser(id);
    await this.userRepository.deleteById(id);
  }

  async checkExistsUser(id: string): Promise<void> {
    const result = await this.userRepository.findById(id);
    if (!result) {
      throw new CustomError(TYPE_ERROR.NOT_FOUND);
    }
  }

  async updateIsConfirmed(id: ObjectId): Promise<void> {
    await this.userRepository.updateIsConfirmed(id);
  }

  async checkUniqueEmailAndLogin(data: UserCreateModel): Promise<void> {
    const userData = await this.userRepository.getUserByEmailOrLogin(data);
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