import { Router } from 'express';
import { commentContentValidator, likeStatusValidator, postDataValidation } from '../common/validation/data.validation';
import { authBaseGuard } from '../common/middlewares/guards/authBase.guard';
import { authJwtGuard } from '../common/middlewares/guards/authJwt.guard';
import { inputValidation } from '../common/validation/input.validation';
import { queryStringPaginationPostsValidation } from '../common/validation/queryStringPagination.validation';
import { container } from "../composition-root";
import { isUserAuthorized } from "../common/middlewares/isUserAuthorized";
import { PostsController } from "./posts.controller";

const postsController = container.resolve(PostsController);

const postsRouter = Router();

postsRouter.get('/', isUserAuthorized, queryStringPaginationPostsValidation, postsController.getPosts);
postsRouter.get('/:id', isUserAuthorized, postsController.getPost);
postsRouter.get('/:id/comments', isUserAuthorized, queryStringPaginationPostsValidation, postsController.getCommentsByPost);
postsRouter.post('/', authBaseGuard, postDataValidation, postsController.creatPost);
postsRouter.post('/:id/comments', authJwtGuard, commentContentValidator, inputValidation, postsController.createCommentByPost);
postsRouter.put('/:id', authBaseGuard, postDataValidation, postsController.updatePost);
postsRouter.put('/:id/like-status', authJwtGuard, likeStatusValidator, inputValidation, postsController.likeStatus);
postsRouter.delete('/:id', authBaseGuard, postsController.deletePost);

export { postsRouter };