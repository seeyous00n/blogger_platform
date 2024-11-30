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
import { BlogCreateModel } from './models/blogCreate.model';
import { BlogUpdateModal } from './models/blogUpdate.modal';
import { PostsQueryRepository } from '../posts/postsQuery.repository';
import { PostCreateModel } from '../posts/models/postCreate.model';
import { PostsViewDto } from '../posts/dto/postsView.dto';
import { BlogsViewDto } from './dto/blogsView.dto';
import { sendError } from '../common/errorHandler';
import { PostService } from '../posts/post.service';
import { BlogService } from "./blog.service";
import { BlogsQueryRepository } from "./blogsQuery.repository";

export class BlogsController {
  constructor(
    private blogService: BlogService,
    private blogsQueryRepository: BlogsQueryRepository,
    private postService: PostService,
    private postsQueryRepository: PostsQueryRepository) {
  }

  getBlogs = async (req: RequestWithQuery<UriParamsModel, queryStringType>, res: Response) => {
    try {
      const result = await this.blogsQueryRepository.findBlogs(req.query);
      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (error) {
      sendError(error, res);
    }
  };

  getBlog = async (req: RequestWithParams<UriParamsModel>, res: Response<BlogsViewDto>) => {
    try {
      const result = await this.blogsQueryRepository.findById(req.params.id);
      if (!result) {
        res.status(HTTP_STATUS_CODE.NOT_FOUND_404).json();
        return;
      }

      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (error) {
      sendError(error, res);
    }
  };

  createBlog = async (req: RequestWithBody<BlogCreateModel>, res: Response<BlogsViewDto>) => {
    try {
      const blog = await this.blogService.createBlog(req.body);
      const result = await this.blogsQueryRepository.findById(blog._id.toString()) as BlogsViewDto;

      res.status(HTTP_STATUS_CODE.CREATED_201).json(result);
    } catch (error) {
      sendError(error, res);
    }
  };

  updateBlog = async (req: RequestWithParamsAndBody<UriParamsModel, BlogUpdateModal>, res: Response) => {
    try {
      await this.blogService.updateBlogById(req.params.id, req.body);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      sendError(error, res);
    }
  };

  deleteBlog = async (req: RequestWithParams<UriParamsModel>, res: Response) => {
    try {
      await this.blogService.deleteBlogById(req.params.id);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      sendError(error, res);
    }
  };

  createPostByBlog = async (req: RequestWithParamsAndBody<UriParamsModel, PostCreateModel>, res: Response<PostsViewDto>) => {
    try {
      req.body.blogId = req.params.id;
      const post = await this.postService.createPost(req.body);
      const result = await this.postsQueryRepository.findById(post._id.toString());
      if (!result) {
        res.status(HTTP_STATUS_CODE.NOT_FOUND_404).json();
        return;
      }

      res.status(HTTP_STATUS_CODE.CREATED_201).json(result);
    } catch (error) {
      sendError(error, res);
    }
  };

  getPostsByBLog = async (req: RequestWithQuery<UriParamsModel, queryStringType>, res: Response) => {
    try {
      const blogId = await this.blogService.findBlogById(req.params.id);
      const result = await this.postsQueryRepository.findPosts(req.query, req.authorizedUserId, blogId);

      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (error) {
      sendError(error, res);
    }
  };
}