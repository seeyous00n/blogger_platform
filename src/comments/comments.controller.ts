import { Response } from 'express';
import { sendError } from '../common/errorHandler';
import { commentQueryRepository } from './commentQuery.repository';
import { HTTP_STATUS_CODE } from '../common/settings';
import { RequestWithParams, RequestWithParamsAndBody } from '../common/types/types';
import { UriParamsModel } from '../common/models/uriParams.model';
import { commentService } from './comment.service';
import { CommentInputUpdateModel } from './models/CommentInputUpdate.model';
import { DataInTokenType } from '../auth/types/auth.type';

class CommentsController {
  getComment = async (req: RequestWithParams<UriParamsModel>, res: Response) => {
    try {
      const result = await commentQueryRepository.findCommentById(req.params.id);
      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (error) {
      sendError(error, res);
    }
  };

  updateComment = async (req: RequestWithParamsAndBody<UriParamsModel, CommentInputUpdateModel>, res: Response) => {
    try {
      await commentService.updateCommentById(req.params.id, { content: req.body.content }, req.body.userId);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      sendError(error, res);
    }
  };

  deleteComment = async (req: RequestWithParamsAndBody<UriParamsModel, DataInTokenType>, res: Response) => {
    try {
      await commentService.deleteCommentById(req.params.id, req.body.userId);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      sendError(error, res);
    }
  };
}

export const commentsController = new CommentsController();