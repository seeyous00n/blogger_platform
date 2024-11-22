import mongoose from "mongoose";
import { UserEntityType } from "../../../users/types/user.types";

const COLLECTION_USERS = 'users';

const userSchema = new mongoose.Schema<UserEntityType>({
  login: String,
  email: String,
  password: {
    hash: String,
    recovery: String,
    expirationDate: Date
  },
  createdAt: String,
  emailConfirmation: {
    confirmationCode: String,
    isConfirmed: Boolean,
    expirationDate: Date
  }
});

export const UserModel = mongoose.model(COLLECTION_USERS, userSchema);