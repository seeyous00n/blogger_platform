import { Response } from 'express';
import { HTTP_STATUS_CODE } from '../settings';
import {
  queryStringType,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from '../types/types';
import { URIParamsModel } from '../models/URIParamsModel';
import { blogService } from '../services/blog-service';
import { BlogCreateModel } from '../models/blog/BlogCreateModel';
import { BlogUpdateModal } from '../models/blog/BlogUpdateModal';
import { blogsQueryRepository } from '../repositories/blogs-query-repository';
import { postsQueryRepository } from '../repositories/posts-query-repository';
import { PostCreateModel } from '../models/post/PostCreateModel';
import { PostsViewDto } from '../dtos/posts-view-dto';
import { BlogsViewDto } from '../dtos/blogs-view-dto';
import { sendError } from '../utils/error-handler';

class BlogsController {
  getBlogs = async (req: RequestWithQuery<URIParamsModel, queryStringType>, res: Response) => {
    try {
      const result = await blogsQueryRepository.findBlogs(req.query);
      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (e: any) {
      sendError(e, res);
    }
  };

  getBlog = async (req: RequestWithParams<URIParamsModel>, res: Response<BlogsViewDto | string>) => {
    try {
      const result = await blogsQueryRepository.findById(req.params.id);
      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (e: any) {
      sendError(e, res);
    }
  };

  createBlog = async (req: RequestWithBody<BlogCreateModel>, res: Response<BlogsViewDto>) => {
    try {
      const result: BlogsViewDto = await blogService.createBlog(req.body);
      res.status(HTTP_STATUS_CODE.CREATED_201).json(result);
    } catch (e: any) {
      sendError(e, res);
    }
  };

  updateBlog = async (req: RequestWithParamsAndBody<URIParamsModel, BlogUpdateModal>, res: Response) => {
    try {
      await blogService.updateBlogById(req.params.id, req.body);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (e: any) {
      sendError(e, res);
    }
  };

  deleteBlog = async (req: RequestWithParams<URIParamsModel>, res: Response) => {
    try {
      await blogService.deleteBlogById(req.params.id);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (e: any) {
      sendError(e, res);
    }
  };

  createPostFromBlog = async (req: RequestWithParamsAndBody<URIParamsModel, PostCreateModel>, res: Response<PostsViewDto>) => {
    try {
      const result: PostsViewDto = await blogService.createPost(req.body, req.params.id);
      res.status(HTTP_STATUS_CODE.CREATED_201).json(result);
    } catch (e: any) {
      sendError(e, res);
    }
  };

  getPostsFromBLog = async (req: RequestWithQuery<URIParamsModel, queryStringType>, res: Response) => {
    try {
      await blogsQueryRepository.findById(req.params.id);
      const result = await postsQueryRepository.findPosts(req.query, req.params.id);
      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (e: any) {
      sendError(e, res);
    }
  };
}

export const blogsController = new BlogsController();