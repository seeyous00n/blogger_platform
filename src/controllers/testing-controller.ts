import { clearDbBlogs, clearDbPosts } from '../db';
import { NextFunction, Request, Response } from 'express';
import { BlogViewModel } from '../models/blog/BlogViewModel';
import { HTTP_MESSAGE, HTTP_STATUS_CODE } from '../settings';

class TestingController {
  clearAllData(req: Request, res: Response, next: NextFunction) {
    try {
      clearDbPosts();
      clearDbBlogs();
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (e) {
      res.status(HTTP_STATUS_CODE.SERVER_ERROR_500).json(HTTP_MESSAGE.SERVER_ERROR);
    }
  }
}

export const testingController = new TestingController();