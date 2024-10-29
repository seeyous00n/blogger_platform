import { usersCollection } from '../db';
import { UserType } from './types/user.types';
import { ObjectId } from 'mongodb';
import { UserCreateModel } from './models/userCreate.model';
import { isObjectId } from '../common/adapters/mongodb.service';

class UserRepository {
  async create(data: UserType) {
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

}

export const userRepository = new UserRepository();