import { Router } from 'express';
import { authJwtGuard } from '../common/middlewares/guards/authJwt.guard';
import { commentsController } from './comments.controller';
import { commentContentValidator } from '../common/validation/data.validation';
import { inputValidation } from '../common/validation/input.validation';

const commentsRouter = Router();

commentsRouter.get('/:id', commentsController.getComment);
commentsRouter.put('/:id', authJwtGuard, commentContentValidator, inputValidation, commentsController.updateComment);
commentsRouter.delete('/:id', authJwtGuard, commentsController.deleteComment);

export { commentsRouter };