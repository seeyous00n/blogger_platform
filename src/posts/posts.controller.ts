import { Response } from 'express';
import { HTTP_STATUS_CODE } from '../common/settings';
import { postService } from './post.service';
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
import { postsQueryRepository } from './postsQuery.repository';
import { PostsViewDto } from './dto/postsView.dto';
import { sendError } from '../common/errorHandler';
import { CommentInputParamModel } from '../comments/models/CommentInputParam.model';
import { commentService } from '../comments/comment.service';
import { commentQueryRepository } from '../comments/commentQuery.repository';

class PostsController {
  getPosts = async (req: RequestWithQuery<UriParamsModel, queryStringType>, res: Response) => {
    try {
      const result = await postsQueryRepository.findPosts(req.query);
      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (error) {
      sendError(error, res);
    }
  };

  getPost = async (req: RequestWithParams<UriParamsModel>, res: Response<PostsViewDto>) => {
    try {
      const result = await postsQueryRepository.findById(req.params.id);
      if (!result) {
        res.status(HTTP_STATUS_CODE.NOT_FOUND_404).json();
        return;
      }

      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (error) {
      sendError(error, res);
    }
  };

  creatPost = async (req: RequestWithBody<PostCreateModel>, res: Response<PostsViewDto>) => {
    try {
      const postId = await postService.createPost(req.body);
      const result = await postsQueryRepository.findById(postId._id.toString()) as PostsViewDto;

      res.status(HTTP_STATUS_CODE.CREATED_201).json(result);
    } catch (error) {
      sendError(error, res);
    }
  };

  updatePost = async (req: RequestWithParamsAndBody<UriParamsModel, PostUpdateModal>, res: Response) => {
    try {
      await postService.updatePostById(req.params.id, req.body);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      sendError(error, res);
    }
  };

  deletePost = async (req: RequestWithParams<UriParamsModel>, res: Response) => {
    try {
      await postService.deletePostById(req.params.id);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      sendError(error, res);
    }
  };

  createCommentByPost = async (req: RequestWithParamsAndBody<UriParamsModel, CommentInputParamModel>, res: Response) => {
    try {
      const commentId = await commentService.createComment({
        postId: req.params.id,
        userId: req.user.userId,
        comment: req.body.content
      });
      const result = await commentQueryRepository.findCommentById(commentId._id.toString());

      res.status(HTTP_STATUS_CODE.CREATED_201).json(result);
    } catch (error) {
      sendError(error, res);
    }
  };

  getCommentsByPost = async (req: RequestWithQuery<UriParamsModel, queryStringType>, res: Response) => {
    try {
      const postId = await postService.findPostById(req.params.id);
      const result = await commentQueryRepository.findComments(req.query, postId.toString());

      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (error) {
      sendError(error, res);
    }
  };
}

export const postsController = new PostsController();