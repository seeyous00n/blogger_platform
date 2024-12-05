import { NextFunction, Response } from 'express';
import { HTTP_STATUS_CODE } from '../common/settings';
import { PostCreateModel } from './models/postCreate.model';
import {
  queryStringType,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from '../common/types/types';
import { UriParamsModel } from '../common/models/uriParams.model';
import { PostUpdateModal } from './models/postUpdate.modal';
import { PostsQueryRepository } from './postsQuery.repository';
import { PostsViewDto } from './dto/postsView.dto';
import { CommentInputParamModel } from '../comments/models/CommentInputParam.model';
import { CommentService } from '../comments/comment.service';
import { CommentQueryRepository } from '../comments/commentQuery.repository';
import { PostService } from "./post.service";
import { LikeStatusType } from "../common/db/schemes/likesSchema";
import { inject, injectable } from "inversify";

@injectable()
export class PostsController {
  constructor(
    @inject(PostService) private postService: PostService,
    @inject(PostsQueryRepository) private postsQueryRepository: PostsQueryRepository,
    @inject(CommentService) private commentService: CommentService,
    @inject(CommentQueryRepository) private commentQueryRepository: CommentQueryRepository) {
  }

  getPosts = async (req: RequestWithQuery<UriParamsModel, queryStringType>, res: Response, next: NextFunction) => {
    try {
      const result = await this.postsQueryRepository.findPosts(req.query, req.authorizedUserId);
      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getPost = async (req: RequestWithParams<UriParamsModel>, res: Response<PostsViewDto>, next: NextFunction) => {
    try {
      const result = await this.postsQueryRepository.findById(req.params.id, req.authorizedUserId);
      if (!result) {
        res.status(HTTP_STATUS_CODE.NOT_FOUND_404).json();
        return;
      }

      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (error) {
      next(error);
    }
  };

  creatPost = async (req: RequestWithBody<PostCreateModel>, res: Response<PostsViewDto>, next: NextFunction) => {
    try {
      const post = await this.postService.createPost(req.body);
      const result = await this.postsQueryRepository.findById(post._id.toString()) as PostsViewDto;

      res.status(HTTP_STATUS_CODE.CREATED_201).json(result);
    } catch (error) {
      next(error);
    }
  };

  updatePost = async (req: RequestWithParamsAndBody<UriParamsModel, PostUpdateModal>, res: Response, next: NextFunction) => {
    try {
      await this.postService.updatePostById(req.params.id, req.body);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      next(error);
    }
  };

  deletePost = async (req: RequestWithParams<UriParamsModel>, res: Response, next: NextFunction) => {
    try {
      await this.postService.deletePostById(req.params.id);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      next(error);
    }
  };

  createCommentByPost = async (req: RequestWithParamsAndBody<UriParamsModel, CommentInputParamModel>, res: Response, next: NextFunction) => {
    try {
      const commentId = await this.commentService.createComment({
        postId: req.params.id,
        userId: req.user.userId,
        comment: req.body.content
      });
      const result = await this.commentQueryRepository.findCommentById(commentId._id.toString());

      res.status(HTTP_STATUS_CODE.CREATED_201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getCommentsByPost = async (req: RequestWithQuery<UriParamsModel, queryStringType>, res: Response, next: NextFunction) => {
    try {
      const postId = await this.postService.findPostById(req.params.id);
      const result = await this.commentQueryRepository.findComments(req.query, postId.toString(), req.authorizedUserId);

      res.status(HTTP_STATUS_CODE.OK_200).json(result);
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
      await this.postService.like(data);

      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      next(error);
    }
  };
}