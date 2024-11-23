import { Router } from 'express';
import { postsController } from './posts.controller';
import { commentContentValidator, postDataValidation } from '../common/validation/data.validation';
import { authBaseGuard } from '../common/middlewares/guards/authBase.guard';
import { authJwtGuard } from '../common/middlewares/guards/authJwt.guard';
import { inputValidation } from '../common/validation/input.validation';
import { queryStringPaginationPostsValidation } from '../common/validation/queryStringPagination.validation';

const postsRouter = Router();

postsRouter.get('/', queryStringPaginationPostsValidation, postsController.getPosts);
postsRouter.get('/:id', postsController.getPost);
postsRouter.get('/:id/comments', queryStringPaginationPostsValidation, postsController.getCommentsByPost);
postsRouter.post('/', authBaseGuard, postDataValidation, postsController.creatPost);
postsRouter.post('/:id/comments', authJwtGuard, commentContentValidator, inputValidation, postsController.createCommentByPost);
postsRouter.put('/:id', authBaseGuard, postDataValidation, postsController.updatePost);
postsRouter.delete('/:id', authBaseGuard, postsController.deletePost);

export { postsRouter };