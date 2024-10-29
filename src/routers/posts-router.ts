import { Router } from 'express';
import { postsController } from '../controllers/posts-controller';
import { commentContentValidator, postDataValidation } from '../validations/data-validation';
import { authValidationMiddleware } from '../middlewares/auth-validation-middleware';
import { authBearerValidationMiddleware } from '../middlewares/auth-bearer-validation-middleware';
import { errorsValidationMiddleware } from '../middlewares/errors-validation-middleware';

const postsRouter = Router();

postsRouter.get('/', postsController.getPosts);
postsRouter.get('/:id', postsController.getPost);
postsRouter.get('/:id/comments', postsController.getCommentsByPost);
postsRouter.post('/', authValidationMiddleware, postDataValidation, postsController.creatPost);
postsRouter.post('/:id/comments', authBearerValidationMiddleware, commentContentValidator, errorsValidationMiddleware, postsController.createCommentByPost);
postsRouter.put('/:id', authValidationMiddleware, postDataValidation, postsController.updatePost);
postsRouter.delete('/:id', authValidationMiddleware, postsController.deletePost);

export { postsRouter };