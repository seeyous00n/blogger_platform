import express, { Response, Request } from 'express';
import { blogsRouter } from './blogs/blogs-router';
import { HTTP_MESSAGE, HTTP_STATUS_CODE, ROUTER_PATHS } from './common/settings';
import { postsRouter } from './posts/posts.router';
import { testingController } from './testing/testing.controller';
import { usersRouter } from './users/users.router';
import { authRouter } from './auth/auth-router';
import { commentsRouter } from './comments/comments-router';

export const app = express();

app.use(express.json());
app.use(ROUTER_PATHS.BLOGS, blogsRouter);
app.use(ROUTER_PATHS.POSTS, postsRouter);
app.use(ROUTER_PATHS.USERS, usersRouter);
app.use(ROUTER_PATHS.COMMENTS, commentsRouter);
app.use(ROUTER_PATHS.AUTH, authRouter);
app.delete(ROUTER_PATHS.TESTING, testingController.clearAllData);
app.use('*', (req: Request, res: Response) => {
  res.status(HTTP_STATUS_CODE.NOT_FOUND_404).send(HTTP_MESSAGE.NOT_FOUND);
});