import { Router } from 'express';
import { authJwtGuard } from '../common/middlewares/guards/authJwt.guard';
import { commentContentValidator, likeStatusValidator } from '../common/validation/data.validation';
import { inputValidation } from '../common/validation/input.validation';
import { commentsController } from "../composition-root";
import { isUserAuthorized } from "../common/middlewares/isUserAuthorized";

const commentsRouter = Router();

commentsRouter.get('/:id', isUserAuthorized, commentsController.getComment);
commentsRouter.put('/:id', authJwtGuard, commentContentValidator, inputValidation, commentsController.updateComment);
commentsRouter.put('/:id/like-status', authJwtGuard, likeStatusValidator, inputValidation, commentsController.likeStatus);
commentsRouter.delete('/:id', authJwtGuard, commentsController.deleteComment);

export { commentsRouter };