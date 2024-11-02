import { Response } from 'express';
import { HTTP_STATUS_CODE } from '../common/settings';
import {
  queryStringType,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from '../common/types/types';
import { UriParamsModel } from '../common/models/uriParams.model';
import { blogService } from './blog.service';
import { BlogCreateModel } from './models/blogCreate.model';
import { BlogUpdateModal } from './models/blogUpdate.modal';
import { blogsQueryRepository } from './blogsQuery.repository';
import { postsQueryRepository } from '../posts/postsQuery.repository';
import { PostCreateModel } from '../posts/models/postCreate.model';
import { PostsViewDto } from '../posts/dto/postsView.dto';
import { BlogsViewDto } from './dto/blogsView.dto';
import { sendError } from '../common/errorHandler';
import { postService } from '../posts/post.service';

class BlogsController {
  getBlogs = async (req: RequestWithQuery<UriParamsModel, queryStringType>, res: Response) => {
    try {
      const result = await blogsQueryRepository.findBlogs(req.query);
      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (error) {
      sendError(error, res);
    }
  };

  getBlog = async (req: RequestWithParams<UriParamsModel>, res: Response<BlogsViewDto>) => {
    try {
      const result = await blogsQueryRepository.findById(req.params.id);
      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (error) {
      sendError(error, res);
    }
  };

  createBlog = async (req: RequestWithBody<BlogCreateModel>, res: Response<BlogsViewDto>) => {
    try {
      const blogId = await blogService.createBlog(req.body);
      const result = await blogsQueryRepository.findById(blogId.insertedId.toString());
      res.status(HTTP_STATUS_CODE.CREATED_201).json(result);
    } catch (error) {
      sendError(error, res);
    }
  };

  updateBlog = async (req: RequestWithParamsAndBody<UriParamsModel, BlogUpdateModal>, res: Response) => {
    try {
      await blogService.updateBlogById(req.params.id, req.body);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      sendError(error, res);
    }
  };

  deleteBlog = async (req: RequestWithParams<UriParamsModel>, res: Response) => {
    try {
      await blogService.deleteBlogById(req.params.id);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      sendError(error, res);
    }
  };

  createPostByBlog = async (req: RequestWithParamsAndBody<UriParamsModel, PostCreateModel>, res: Response<PostsViewDto>) => {
    try {
      req.body.blogId = req.params.id;
      const postId = await postService.createPost(req.body);
      const result = await postsQueryRepository.findById(postId.insertedId.toString());
      res.status(HTTP_STATUS_CODE.CREATED_201).json(result);
    } catch (error) {
      sendError(error, res);
    }
  };

  getPostsByBLog = async (req: RequestWithQuery<UriParamsModel, queryStringType>, res: Response) => {
    try {
      const blogId = await blogService.findBlogById(req.params.id);
      const result = await postsQueryRepository.findPosts(req.query, blogId);
      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (error) {
      sendError(error, res);
    }
  };
}

export const blogsController = new BlogsController();