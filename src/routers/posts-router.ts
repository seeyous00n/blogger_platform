import { Router } from 'express';
import { postsController } from '../controllers/posts-controller';
import { postDataUpdateValidation, postDataValidation } from '../validations/data-validation';
import { authValidationMiddleware } from '../middlewares/auth-validation-middleware';

const postsRouter = Router();

postsRouter.get('/', postsController.getPosts);
postsRouter.get('/:id', postsController.getPost);
postsRouter.post('/', authValidationMiddleware, postDataValidation, postsController.creatPost);
postsRouter.put('/:id', authValidationMiddleware, postDataUpdateValidation, postsController.updatePost);
postsRouter.delete('/:id', authValidationMiddleware, postsController.deletePost);

export { postsRouter };