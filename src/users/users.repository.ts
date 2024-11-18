import { usersCollection } from '../db';
import { UserEntityType } from './types/user.types';
import { InsertOneResult, ObjectId, WithId } from 'mongodb';
import { UserCreateModel } from './models/userCreate.model';
import { isObjectId } from '../common/adapters/mongodb.service';
import { AuthType } from '../auth/types/auth.type';
import { UserByEmailOrLogin } from './models/userByEmailOrLogin.model';

class UserRepository {
  async create(data: UserEntityType): Promise<InsertOneResult<UserEntityType>> {
    return await usersCollection.insertOne(data);
  };

  async findById(id: string): Promise<WithId<UserEntityType> | null> {
    isObjectId(id);
    return await usersCollection.findOne({ _id: new ObjectId(id) });
  }

  async deleteById(id: string): Promise<void> {
    await usersCollection.deleteOne({ _id: new ObjectId(id) });
  }

  async getUserByEmailOrLogin(data: UserCreateModel): Promise<UserByEmailOrLogin> {
    const email = await usersCollection.findOne({ email: data.email });
    const login = await usersCollection.findOne({ login: data.login });

    return { email, login };
  }

  async findByConfirmationCode(code: string): Promise<WithId<UserEntityType> | null> {
    return await usersCollection.findOne({ 'emailConfirmation.confirmationCode': code });
  }

  async findByEmail(email: string): Promise<WithId<UserEntityType> | null> {
    return await usersCollection.findOne({ email: email });
  }

  async updateIsConfirmed(id: ObjectId): Promise<void> {
    await usersCollection.updateOne(
      { _id: id },
      { $set: { 'emailConfirmation.isConfirmed': true } },
    );
  }

  async updateConfirmationCode(id: ObjectId, newCode: string): Promise<void> {
    await usersCollection.updateOne(
      { _id: id },
      { $set: { 'emailConfirmation.confirmationCode': newCode } },
    );
  }

  async findByLoginOrEmail(data: AuthType): Promise<WithId<UserEntityType> | null> {
    return await usersCollection.findOne({ $or: [{ email: data.loginOrEmail }, { login: data.loginOrEmail }] });
  }
}

export const userRepository = new UserRepository();