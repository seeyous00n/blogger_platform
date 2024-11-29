import { UserEntityType } from './types/user.types';
import { ObjectId, WithId } from 'mongodb';
import { UserCreateModel } from './models/userCreate.model';
import { isObjectId } from '../common/adapters/mongodb.service';
import { AuthType, updateRecoveryCodeType } from '../auth/types/auth.type';
import { UserDocument, UserModel } from "../common/db/schemes/userSchema";

export class UserRepository {
  async create(data: UserEntityType): Promise<UserDocument> {
    return await UserModel.create(data);
  };

  async findById(id: string): Promise<WithId<UserEntityType> | null> {
    isObjectId(id);
    return UserModel.findOne({ _id: new ObjectId(id) }).lean();
  }

  async deleteById(id: string): Promise<void> {
    await UserModel.deleteOne({ _id: new ObjectId(id) });
  }

  async getUserByEmailOrLogin(data: UserCreateModel): Promise<WithId<UserEntityType> | null> {
    return UserModel.findOne({ $or: [{ email: data.email }, { login: data.login }] }).lean();
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

  async updateRecoveryCode(data: updateRecoveryCodeType): Promise<void> {
    await UserModel.updateOne({ _id: data.id }, {
      $set: {
        'password.recovery': data.code,
        'password.expirationDate': data.expirationDate
      }
    });
  }

  async findByRecoveryCode(code: string): Promise<WithId<UserEntityType> | null> {
    return UserModel.findOne({ 'password.recovery': code }).lean();
  }

  async updatePassword(data: { id: ObjectId, hash: string }): Promise<void> {
    await UserModel.updateOne(
      { _id: data.id },
      { $set: { 'password.hash': data.hash } },
    );
  }

}