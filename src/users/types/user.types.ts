import { ObjectId } from 'mongodb';
import { UserCreateInputModel } from "../models/userCreateInput.model";

export type UserEntityType = {
  login: string,
  email: string,
  password: {
    hash: string,
    recovery: string | null,
    expirationDate: Date | null
  },
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

export type CreateUserDtoType = Omit<UserCreateInputModel, 'password'> & { hash: string }