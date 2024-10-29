import { Response } from 'express';
import { HTTP_STATUS_CODE } from '../settings';
import { postService } from '../services/post-service';
import { PostCreateModel } from '../models/post/PostCreateModel';
import {
  queryStringType,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from '../types/types';
import { URIParamsModel } from '../models/URIParamsModel';
import { PostUpdateModal } from '../models/post/PostUpdateModal';
import { postsQueryRepository } from '../repositories/posts-query-repository';
import { PostsViewDto } from '../dtos/posts-view-dto';
import { sendError } from '../utils/error-handler';
import { CommentInputParamModel } from '../models/comment/CommentInputParamModel';
import { commentService } from '../services/comment-service';
import { commentQueryRepository } from '../repositories/comment-query-repository';

class PostsController {
  getPosts = async (req: RequestWithQuery<URIParamsModel, queryStringType>, res: Response) => {
    try {
      const result = await postsQueryRepository.findPosts(req.query);
      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (e: any) {
      sendError(e, res);
    }
  };

  getPost = async (req: RequestWithParams<URIParamsModel>, res: Response<PostsViewDto>) => {
    try {
      const result: PostsViewDto = await postsQueryRepository.findById(req.params.id);
      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (e: any) {
      sendError(e, res);
    }
  };

  creatPost = async (req: RequestWithBody<PostCreateModel>, res: Response<PostsViewDto>) => {
    try {
      const postId = await postService.createPost(req.body);
      const result = await postsQueryRepository.findById(postId.insertedId.toString());
      res.status(HTTP_STATUS_CODE.CREATED_201).json(result);
    } catch (e: any) {
      sendError(e, res);
    }
  };

  updatePost = async (req: RequestWithParamsAndBody<URIParamsModel, PostUpdateModal>, res: Response) => {
    try {
      await postService.updatePostById(req.params.id, req.body);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (e: any) {
      sendError(e, res);
    }
  };

  deletePost = async (req: RequestWithParams<URIParamsModel>, res: Response) => {
    try {
      await postService.deletePostById(req.params.id);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (e: any) {
      sendError(e, res);
    }
  };

  createCommentByPost = async (req: RequestWithParamsAndBody<URIParamsModel, CommentInputParamModel>, res: Response) => {
    try {
      const commentId = await commentService.createComment({
        postId: req.params.id,
        userId: req.body.userId,
        comment: req.body.content
      });
      const result = await commentQueryRepository.findCommentById(commentId.insertedId.toString());
      res.status(HTTP_STATUS_CODE.CREATED_201).json(result);
    } catch (e: any) {
      sendError(e, res);
    }
  };

  getCommentsByPost = async (req: RequestWithQuery<URIParamsModel, queryStringType>, res: Response) => {
    try {
      const postId = await postService.findPostById(req.params.id)
      const result = await commentQueryRepository.findComments(req.query, postId.toString());
      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (e: any) {
      sendError(e, res);
    }
  };
}

export const postsController = new PostsController();