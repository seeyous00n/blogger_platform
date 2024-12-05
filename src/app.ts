import express, { Response, Request } from 'express';
import { blogsRouter } from './blogs/blogs.router';
import { HTTP_MESSAGE, HTTP_STATUS_CODE, ROUTER_PATHS } from './common/settings';
import { postsRouter } from './posts/posts.router';
import { usersRouter } from './users/users.router';
import { authRouter } from './auth/auth.router';
import { commentsRouter } from './comments/comments.router';
import cookieParser from "cookie-parser";
import { securityRouter } from "./security/security.router";
import { CronService } from "./common/services/cron.service";
import { testingController } from "./composition-root";
import { sendError } from "./common/errorHandler";

export const app = express();

app.use(express.json());
app.set('trust proxy', true);
app.use(cookieParser());
app.use(ROUTER_PATHS.BLOGS, blogsRouter);
app.use(ROUTER_PATHS.POSTS, postsRouter);
app.use(ROUTER_PATHS.USERS, usersRouter);
app.use(ROUTER_PATHS.COMMENTS, commentsRouter);
app.use(ROUTER_PATHS.AUTH, authRouter);
app.use(ROUTER_PATHS.SECURITY, securityRouter);
app.delete(ROUTER_PATHS.TESTING, testingController.clearAllData);
app.use('*', (req: Request, res: Response) => {
  res.status(HTTP_STATUS_CODE.NOT_FOUND_404).send(HTTP_MESSAGE.NOT_FOUND);
});
//@ts-ignore
app.use(sendError);

const cronSession = new CronService(60);
cronSession.deleteExpiredSessions().then();