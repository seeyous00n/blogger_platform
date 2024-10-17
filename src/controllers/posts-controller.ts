import { NextFunction, Request, Response } from 'express';
import { blogService } from '../services/blog-service';
import { HTTP_MESSAGE, HTTP_STATUS_CODE } from '../settings';
import { postService } from '../services/post-service';
import { PostType } from '../types/post-types';
import { PostCreateModel } from '../models/post/PostCreateModel';
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from '../types/types';
import { URIParamsModel } from '../models/URIParamsModel';
import { PostViewModel } from '../models/post/PostViewModel';
import { PostUpdateModal } from '../models/post/PostUpdateModal';

class PostsController {
  getPosts = (req: Request, res: Response<PostType[] | string>, next: NextFunction) => {
    try {
      const result: PostType[] = postService.getAllPosts();
      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (e: any) {
      res.status(HTTP_STATUS_CODE.SERVER_ERROR_500).json(HTTP_MESSAGE.SERVER_ERROR);
    }
  };
  getPost = (req: RequestWithParams<URIParamsModel>, res: Response<PostType | string>, next: NextFunction) => {
    try {
      const result = <PostType>postService.getPostById(+req.params.id);
      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (e: any) {
      const err = JSON.parse(e.message);
      res.status(err.status).json(err.message);
    }
  };
  creatPost = (req: RequestWithBody<PostCreateModel>, res: Response<PostViewModel | string>, next: NextFunction) => {
    try {
      const result: PostType = postService.createPost(req.body);
      res.status(HTTP_STATUS_CODE.CREATED_201).json(result);
    } catch (e: any) {
      res.status(HTTP_STATUS_CODE.SERVER_ERROR_500).json(HTTP_MESSAGE.SERVER_ERROR);
    }
  };
  updatePost = (req: RequestWithParamsAndBody<URIParamsModel, PostUpdateModal>, res: Response, next: NextFunction) => {
    try {
      postService.updatePostById(+req.params.id, req.body);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (e: any) {
      const err = JSON.parse(e.message);
      res.status(err.status).json(err.message);
    }
  };
  deletePost = (req: RequestWithParams<URIParamsModel>, res: Response, next: NextFunction) => {
    try {
      postService.deletePostById(+req.params.id);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (e: any) {
      const err = JSON.parse(e.message);
      res.status(err.status).json(err.message);
    }
  };
}

export const postsController = new PostsController();