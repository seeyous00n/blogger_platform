import { Request, Response } from 'express';
import { HTTP_MESSAGE, HTTP_STATUS_CODE } from '../common/settings';
import { BlogModel } from "../common/db/schemes/blogSchema";
import { PostModel } from "../common/db/schemes/postSchema";
import { UserModel } from "../common/db/schemes/userSchema";
import { CommentModel } from "../common/db/schemes/commentSchema";
import { SessionModel } from "../common/db/schemes/sessionSchema";
import { RateLimitModel } from "../common/db/schemes/rateLimitSchema";

class TestingController {
  async clearAllData(req: Request, res: Response): Promise<void> {
    try {
      await BlogModel.deleteMany({});
      await PostModel.deleteMany({});
      await UserModel.deleteMany({});
      await SessionModel.deleteMany({});
      await CommentModel.deleteMany({});
      await RateLimitModel.deleteMany({});
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      res.status(HTTP_STATUS_CODE.SERVER_ERROR_500).json(HTTP_MESSAGE.SERVER_ERROR);
    }
  }
}

export const testingController = new TestingController();