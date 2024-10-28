import { ObjectId } from 'mongodb';

export type UserType = {
  _id: ObjectId,
  login: string,
  email: string,
  passwordHash: string,
  createdAt: string
}