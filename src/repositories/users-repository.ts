import { usersCollection } from '../db';
import { UserType } from '../types/user-types';
import { ObjectId } from 'mongodb';
import { UserCreateModel } from '../models/user/UserCreateModel';

class UserRepository {
  async create(data: UserType) {
    return await usersCollection.insertOne(data);
  };

  async findById(id: string) {
    try {
      return await usersCollection.findOne({ _id: new ObjectId(id) });
    } catch (e) {
      return;
    }
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