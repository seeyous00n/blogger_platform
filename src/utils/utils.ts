import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { NotFoundError } from './error-handler';
import { ERROR_MESSAGE } from '../types/types';

export const generatePasswordHash = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const isObjectId = async (id: string) => {
  if (!ObjectId.isValid(id)) {
    throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND);
  }
};