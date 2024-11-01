import { postsCollection, usersCollection } from '../db';
import { UserEntityType } from './types/user.types';
import { ObjectId } from 'mongodb';
import { UserCreateModel } from './models/userCreate.model';
import { isObjectId } from '../common/adapters/mongodb.service';

class UserRepository {
  async create(data: UserEntityType) {
    return await usersCollection.insertOne(data);
  };

  async findById(id: string) {
    await isObjectId(id);
    return await usersCollection.findOne({ _id: new ObjectId(id) });
  }

  async deleteById(id: string) {
    await usersCollection.deleteOne({ _id: new ObjectId(id) });
  }

  async getUserByEmailOrLogin(data: UserCreateModel) {
    const email = await usersCollection.findOne({ email: data.email });
    const login = await usersCollection.findOne({ login: data.login });

    return { email, login };
  }

  async findByConfirmationCode(code: string) {
    return await usersCollection.findOne({ 'emailConfirmation.confirmationCode': code });
  }

  async findByEmail(email: string) {
    return await usersCollection.findOne({ email: email });
  }

  async updateIsConfirmed(code: string) {
    return await usersCollection.updateOne(
      { 'emailConfirmation.confirmationCode': code },
      { $set: { 'emailConfirmation.isConfirmed': true } },
    );
  }

  async updateConfirmationCode(code: string, newCode: string) {
    return await usersCollection.updateOne(
      { 'emailConfirmation.confirmationCode': code },
      { $set: { 'emailConfirmation.confirmationCode': newCode } },
    );
  }

}

export const userRepository = new UserRepository();