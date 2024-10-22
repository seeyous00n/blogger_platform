import { Request, Response } from 'express';
import { HTTP_MESSAGE, HTTP_STATUS_CODE } from '../settings';
import { postService } from '../services/post-service';
import { PostType } from '../types/post-types';
import { PostCreateModel } from '../models/post/PostCreateModel';
import {
  queryStringType,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from '../types/types';
import { URIParamsModel } from '../models/URIParamsModel';
import { PostViewModel } from '../models/post/PostViewModel';
import { PostUpdateModal } from '../models/post/PostUpdateModal';
import { postsQueryRepository } from '../repositories/posts-query-repository';

class PostsController {
  getPosts = async (req: RequestWithQuery<URIParamsModel, queryStringType>, res: Response) => {
    try {
      const result = await postsQueryRepository.findPosts(req.query);
      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (e: any) {
      res.status(HTTP_STATUS_CODE.SERVER_ERROR_500).json(HTTP_MESSAGE.SERVER_ERROR);
    }
  };

  getPost = async (req: RequestWithParams<URIParamsModel>, res: Response<PostType>) => {
    try {
      const result = await postsQueryRepository.findById(req.params.id);
      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (e: any) {
      const err = JSON.parse(e.message);
      res.status(err.status).json(err.message);
    }
  };

  creatPost = async (req: RequestWithBody<PostCreateModel>, res: Response<PostViewModel | string>) => {
    try {
      const result: PostType = await postService.createPost(req.body);
      res.status(HTTP_STATUS_CODE.CREATED_201).json(result);
    } catch (e: any) {
      res.status(HTTP_STATUS_CODE.SERVER_ERROR_500).json(HTTP_MESSAGE.SERVER_ERROR);
    }
  };

  updatePost = async (req: RequestWithParamsAndBody<URIParamsModel, PostUpdateModal>, res: Response) => {
    try {
      await postService.updatePostById(req.params.id, req.body);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (e: any) {
      const err = JSON.parse(e.message);
      res.status(err.status).json(err.message);
    }
  };

  deletePost = async (req: RequestWithParams<URIParamsModel>, res: Response) => {
    try {
      await postService.deletePostById(req.params.id);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (e: any) {
      const err = JSON.parse(e.message);
      res.status(err.status).json(err.message);
    }
  };
}

export const postsController = new PostsController();