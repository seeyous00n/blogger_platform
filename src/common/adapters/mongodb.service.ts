import { ObjectId } from 'mongodb';
import { CustomError, TYPE_ERROR } from '../errorHandler';
import { ERROR_MESSAGE } from '../types/types';

export const isObjectId = (id: string): void => {
  if (!ObjectId.isValid(id)) {
    throw new CustomError(TYPE_ERROR.NOT_FOUND, ERROR_MESSAGE.NOT_FOUND);
  }
};