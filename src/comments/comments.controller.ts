import { Response } from 'express';
import { sendError } from '../common/errorHandler';
import { CommentQueryRepository } from './commentQuery.repository';
import { HTTP_STATUS_CODE } from '../common/settings';
import { RequestWithParams, RequestWithParamsAndBody } from '../common/types/types';
import { UriParamsModel } from '../common/models/uriParams.model';
import { CommentService } from './comment.service';
import { CommentInputUpdateModel } from './models/CommentInputUpdate.model';
import { DataInAccessTokenType } from '../auth/types/auth.type';
import { LikeStatusType } from "../common/db/schemes/likesSchema";
import { isLoginUser } from "../like/like.service";

export class CommentsController {
  constructor(
    private commentService: CommentService,
    private commentQueryRepository: CommentQueryRepository) {
  }

  getComment = async (req: RequestWithParams<UriParamsModel>, res: Response) => {
    try {
      //TODO
      const userId = await isLoginUser(req);
      const result = await this.commentQueryRepository.findCommentById(req.params.id, userId);

      if (!result) {
        res.status(HTTP_STATUS_CODE.NOT_FOUND_404).json();
        return;
      }

      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (error) {
      sendError(error, res);
    }
  };

  updateComment = async (req: RequestWithParamsAndBody<UriParamsModel, CommentInputUpdateModel>, res: Response) => {
    try {
      await this.commentService.updateCommentById(req.params.id, { content: req.body.content }, req.user.userId);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      sendError(error, res);
    }
  };

  deleteComment = async (req: RequestWithParamsAndBody<UriParamsModel, DataInAccessTokenType>, res: Response) => {
    try {
      //TODO delete comments with post? hmmm...
      await this.commentService.deleteCommentById(req.params.id, req.user.userId);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      sendError(error, res);
    }
  };

  likeStatus = async (req: RequestWithParamsAndBody<UriParamsModel, { likeStatus: LikeStatusType }>, res: Response) => {
    try {
      const data = {
        likeStatus: req.body.likeStatus,
        parentId: req.params.id,
        authorId: req.user.userId
      };
      await this.commentService.updateLike(data);

      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      sendError(error, res);
    }
  };
}