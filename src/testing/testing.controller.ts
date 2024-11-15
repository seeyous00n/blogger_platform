import { Request, Response } from 'express';
import { HTTP_MESSAGE, HTTP_STATUS_CODE } from '../common/settings';
import {
  blogsCollection,
  commentsCollection,
  postsCollection,
  sessionCollection,
  tokensCollection,
  usersCollection
} from '../db';

class TestingController {
  async clearAllData(req: Request, res: Response): Promise<void> {
    try {
      await blogsCollection.deleteMany({});
      await postsCollection.deleteMany({});
      await usersCollection.deleteMany({});
      await tokensCollection.deleteMany({});
      await commentsCollection.deleteMany({});
      await sessionCollection.deleteMany({});
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      res.status(HTTP_STATUS_CODE.SERVER_ERROR_500).json(HTTP_MESSAGE.SERVER_ERROR);
    }
  }
}

export const testingController = new TestingController();