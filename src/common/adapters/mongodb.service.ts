import { ObjectId } from 'mongodb';
import { NotFoundError } from '../errorHandler';
import { ERROR_MESSAGE } from '../types/types';

export const isObjectId = async (id: string) => {
  if (!ObjectId.isValid(id)) {
    throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND);
  }
};