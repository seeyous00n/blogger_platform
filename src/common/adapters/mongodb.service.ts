import { ObjectId } from 'mongodb';
import { CustomError, NotFoundError, TYPE_ERROR } from '../errorHandler';
import { ERROR_MESSAGE } from '../types/types';

export const isObjectId = async (id: string) => {
  if (!ObjectId.isValid(id)) {
    //throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND);
    throw new CustomError(TYPE_ERROR.NOT_FOUND, ERROR_MESSAGE.NOT_FOUND, [])
  }
};