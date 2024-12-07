import { NextFunction, Response } from 'express';
import { CommentQueryRepository } from './commentQuery.repository';
import { HTTP_STATUS_CODE } from '../common/settings';
import { RequestWithParams, RequestWithParamsAndBody } from '../common/types/types';
import { UriParamsModel } from '../common/models/uriParams.model';
import { CommentService } from './comment.service';
import { CommentInputUpdateModel } from './models/CommentInputUpdate.model';
import { DataInAccessTokenType } from '../auth/types/auth.type';
import { LikeStatusType } from "../common/db/schemes/likesSchema";
import { inject, injectable } from "inversify";

@injectable()
export class CommentsController {
  constructor(
    @inject(CommentService) private commentService: CommentService,
    @inject(CommentQueryRepository) private commentQueryRepository: CommentQueryRepository) {
  }

  getComment = async (req: RequestWithParams<UriParamsModel>, res: Response, next: NextFunction) => {
    try {
      const result = await this.commentQueryRepository.findCommentById(req.params.id, req.authorizedUserId);

      if (!result) {
        res.status(HTTP_STATUS_CODE.NOT_FOUND_404).json();
        return;
      }

      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (error) {
      next(error);
    }
  };

  updateComment = async (req: RequestWithParamsAndBody<UriParamsModel, CommentInputUpdateModel>, res: Response, next: NextFunction) => {
    try {
      await this.commentService.updateCommentById(req.params.id, { content: req.body.content }, req.user.userId);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      next(error);
    }
  };

  deleteComment = async (req: RequestWithParamsAndBody<UriParamsModel, DataInAccessTokenType>, res: Response, next: NextFunction) => {
    try {
      await this.commentService.deleteCommentById(req.params.id, req.user.userId);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      next(error);
    }
  };

  likeStatus = async (req: RequestWithParamsAndBody<UriParamsModel, {
    likeStatus: LikeStatusType
  }>, res: Response, next: NextFunction) => {
    try {
      const data = {
        likeStatus: req.body.likeStatus,
        parentId: req.params.id,
        authorId: req.user.userId
      };
      await this.commentService.like(data);

      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      next(error);
    }
  };
}