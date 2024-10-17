import express, { NextFunction, Response, Request } from 'express';
import { blogsRouter } from './routers/blogs-router';
import { ROUTER_PATHS } from './settings';
import { postsRouter } from './routers/posts-router';
import { testingController } from './controllers/testing-controller';

export const app = express();

app.use(express.json());
app.use(ROUTER_PATHS.BLOGS, blogsRouter);
app.use(ROUTER_PATHS.POSTS, postsRouter);
app.delete(ROUTER_PATHS.TESTING, testingController.clearAllData);
app.use('*', (req: Request, res: Response, next: NextFunction) => {
  res.status(404).send('Not Found');
});