import { ObjectId } from 'mongodb';
import { UserCreateInputModel } from "../models/userCreateInput.model";

export type Password = {
  hash: string,
  recovery: string | null,
  expirationDate: Date | null
};

export type EmailConfirmation = {
  confirmationCode: string,
  isConfirmed: boolean,
  expirationDate: Date
}

export type UserEntityType = {
  login: string,
  email: string,
  password: Password,
  createdAt: string,
  emailConfirmation: EmailConfirmation
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