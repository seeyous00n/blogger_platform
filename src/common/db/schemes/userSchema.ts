import mongoose, { HydratedDocument, Model } from "mongoose";
import { EmailConfirmation, Password, UserEntityType } from "../../../users/types/user.types";

const COLLECTION_USERS = 'users';

type UserModel = Model<UserEntityType>;

export type UserDocument = HydratedDocument<UserEntityType>;

const passwordSchema = new mongoose.Schema<Password>({
  hash: String,
  recovery: String,
  expirationDate: Date
});

const emailConfirmationSchema = new mongoose.Schema<EmailConfirmation>({
  confirmationCode: String,
  isConfirmed: Boolean,
  expirationDate: Date
});

const userSchema = new mongoose.Schema<UserEntityType>({
  login: String,
  email: String,
  password: passwordSchema,
  createdAt: String,
  emailConfirmation: emailConfirmationSchema
});

export const UserModel = mongoose.model<UserEntityType, UserModel>(COLLECTION_USERS, userSchema);