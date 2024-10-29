import { Router } from 'express';
import { authBearerValidationMiddleware } from '../middlewares/auth-bearer-validation-middleware';
import { commentsController } from '../controllers/comments-controller';
import { commentContentValidator } from '../validations/data-validation';
import { errorsValidationMiddleware } from '../middlewares/errors-validation-middleware';


const commentsRouter = Router();

commentsRouter.get('/:id', commentsController.getComment);
commentsRouter.put('/:id', authBearerValidationMiddleware, commentContentValidator, errorsValidationMiddleware, commentsController.updateComment);
commentsRouter.delete('/:id', authBearerValidationMiddleware, commentsController.deleteComment);


export { commentsRouter };