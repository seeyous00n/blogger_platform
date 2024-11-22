import { UserEntityType } from './types/user.types';
import { InsertOneResult, ObjectId, WithId } from 'mongodb';
import { UserCreateModel } from './models/userCreate.model';
import { isObjectId } from '../common/adapters/mongodb.service';
import { AuthType } from '../auth/types/auth.type';
import { UserByEmailOrLogin } from './models/userByEmailOrLogin.model';
import { UserModel } from "../common/db/schemes/userSchema";

class UserRepository {
  async create(data: UserEntityType) {
    return await UserModel.create(data);
  };

  async findById(id: string): Promise<WithId<UserEntityType> | null> {
    isObjectId(id);
    return UserModel.findOne({ _id: new ObjectId(id) }).lean();
  }

  async deleteById(id: string): Promise<void> {
    await UserModel.deleteOne({ _id: new ObjectId(id) });
  }

  async getUserByEmailOrLogin(data: UserCreateModel): Promise<UserByEmailOrLogin> {
    const email = await UserModel.findOne({ email: data.email }).lean();
    const login = await UserModel.findOne({ login: data.login }).lean();

    return { email, login };
  }

  async findByConfirmationCode(code: string): Promise<WithId<UserEntityType> | null> {
    return UserModel.findOne({ 'emailConfirmation.confirmationCode': code }).lean();
  }

  async findByEmail(email: string): Promise<WithId<UserEntityType> | null> {
    return UserModel.findOne({ email: email }).lean();
  }

  async updateIsConfirmed(id: ObjectId): Promise<void> {
    await UserModel.updateOne(
      { _id: id },
      { $set: { 'emailConfirmation.isConfirmed': true } },
    );
  }

  async updateConfirmationCode(id: ObjectId, newCode: string): Promise<void> {
    await UserModel.updateOne(
      { _id: id },
      { $set: { 'emailConfirmation.confirmationCode': newCode } },
    );
  }

  async findByLoginOrEmail(data: AuthType): Promise<WithId<UserEntityType> | null> {
    return UserModel.findOne({ $or: [{ email: data.loginOrEmail }, { login: data.loginOrEmail }] }).lean();
  }
}

export const userRepository = new UserRepository();