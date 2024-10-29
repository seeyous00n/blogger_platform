import { Response } from 'express';
import { sendError } from '../utils/error-handler';
import { commentQueryRepository } from '../repositories/comment-query-repository';
import { HTTP_STATUS_CODE } from '../settings';
import { RequestWithParams, RequestWithParamsAndBody } from '../types/types';
import { URIParamsModel } from '../models/URIParamsModel';
import { commentService } from '../services/comment-service';
import { CommentInputUpdateModel } from '../models/comment/CommentInputUpdateModel';
import { TokenType } from '../types/auth-type';

class CommentsController {
  getComment = async (req: RequestWithParams<URIParamsModel>, res: Response) => {
    try {
      const result = await commentQueryRepository.findCommentById(req.params.id);
      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (e: any) {
      sendError(e, res);
    }
  };

  updateComment = async (req: RequestWithParamsAndBody<URIParamsModel, CommentInputUpdateModel>, res: Response) => {
    try {
      await commentService.updateCommentById(req.params.id, { content: req.body.content }, req.body.userId);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (e: any) {
      sendError(e, res);
    }
  };

  deleteComment = async (req: RequestWithParamsAndBody<URIParamsModel, TokenType>, res: Response) => {
    try {
      await commentService.deleteCommentById(req.params.id, req.body.userId);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (e: any) {
      sendError(e, res);
    }
  };

}

export const commentsController = new CommentsController();