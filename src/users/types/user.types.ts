import { ObjectId } from 'mongodb';

export type UserEntityType = {
  login: string,
  email: string,
  passwordHash: string,
  createdAt: string,
  emailConfirmation: {
    confirmationCode: string,
    isConfirmed: boolean,
    expirationDate: Date
  }
}

export type UserViewType = UserEntityType & {
  _id: ObjectId,
}

export type UserViewAuthType = {
  _id: ObjectId,
  login: string,
  email: string,
}