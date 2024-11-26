import { Router } from 'express';
import { authJwtGuard } from '../common/middlewares/guards/authJwt.guard';
import { commentContentValidator } from '../common/validation/data.validation';
import { inputValidation } from '../common/validation/input.validation';
import { commentsController } from "../composition-root";

const commentsRouter = Router();

commentsRouter.get('/:id', commentsController.getComment);
commentsRouter.put('/:id', authJwtGuard, commentContentValidator, inputValidation, commentsController.updateComment);
commentsRouter.delete('/:id', authJwtGuard, commentsController.deleteComment);

export { commentsRouter };