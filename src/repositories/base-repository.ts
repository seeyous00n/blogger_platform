import { ObjectId } from 'mongodb';
import { NotFoundError } from '../utils/error-handler';
import { ERROR_MESSAGE } from '../types/types';

export class BaseRepository {
  async isObjectId(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND);
    }
  }
}
