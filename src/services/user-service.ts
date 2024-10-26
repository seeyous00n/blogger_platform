import { UserCreateModel } from '../models/user/UserCreateModel';
import { ObjectId } from 'mongodb';
import { UserType } from '../types/user-types';
import bcrypt from 'bcrypt';
import { usersRepository } from '../repositories/users-repository';
import { NotFoundError, ValidationError } from '../utils/error-handler';
import { ERROR_MESSAGE } from '../types/types';
import { UserViewDto } from '../dtos/users-view-dto';

class UserService {
  async createUser(data: UserCreateModel) {
    const isUser = await usersRepository.isUserEmpty(data);
    const error = { field: 'email or login', message: 'email should be unique' };
    if (isUser.email || isUser.login) {
      throw new ValidationError(JSON.stringify(error));
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(data.password, salt);

    const newUser: UserType = {
      ...data,
      password: hash,
      _id: new ObjectId(),
      salt: salt,
      createdAt: new Date().toISOString(),
    };

    const user = await usersRepository.create(newUser);
    const result = await usersRepository.findById(user.insertedId.toString());
    if (!result) {
      throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND);
    }

    return new UserViewDto(result);
  }

  async deleteUser(id: string) {
    const result = await usersRepository.findById(id);
    if (!result) {
      throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND);
    }

    await usersRepository.deleteById(id);
  }
}

export const userService = new UserService();