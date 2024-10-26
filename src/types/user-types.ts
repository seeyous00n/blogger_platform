import { ObjectId } from 'mongodb';

export type UserType = {
  _id: ObjectId,
  login: string,
  email: string,
  password: string,
  salt: string,
  createdAt: string
}