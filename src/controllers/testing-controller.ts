import { Request, Response } from 'express';
import { HTTP_MESSAGE, HTTP_STATUS_CODE } from '../settings';
import { blogsCollection, postsCollection } from '../db';

class TestingController {
  async clearAllData(req: Request, res: Response) {
    try {
      await blogsCollection.deleteMany({});
      await postsCollection.deleteMany({});
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (e) {
      res.status(HTTP_STATUS_CODE.SERVER_ERROR_500).json(HTTP_MESSAGE.SERVER_ERROR);
    }
  }
}

export const testingController = new TestingController();