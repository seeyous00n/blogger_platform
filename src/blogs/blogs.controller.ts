import { NextFunction, Response } from 'express';
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
import { PostService } from '../posts/post.service';
import { BlogService } from "./blog.service";
import { BlogsQueryRepository } from "./blogsQuery.repository";
import { inject, injectable } from "inversify";

@injectable()
export class BlogsController {
  constructor(
    @inject(BlogService) private blogService: BlogService,
    @inject(BlogsQueryRepository) private blogsQueryRepository: BlogsQueryRepository,
    @inject(PostService) private postService: PostService,
    @inject(PostsQueryRepository) private postsQueryRepository: PostsQueryRepository) {
  }

  getBlogs = async (req: RequestWithQuery<UriParamsModel, queryStringType>, res: Response, next: NextFunction) => {
    try {
      const result = await this.blogsQueryRepository.findBlogs(req.query);
      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getBlog = async (req: RequestWithParams<UriParamsModel>, res: Response<BlogsViewDto>, next: NextFunction) => {
    try {
      const result = await this.blogsQueryRepository.findById(req.params.id);
      if (!result) {
        res.status(HTTP_STATUS_CODE.NOT_FOUND_404).json();
        return;
      }

      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (error) {
      next(error);
    }
  };

  createBlog = async (req: RequestWithBody<BlogCreateModel>, res: Response<BlogsViewDto>, next: NextFunction) => {
    try {
      const blog = await this.blogService.createBlog(req.body);
      const result = await this.blogsQueryRepository.findById(blog._id.toString()) as BlogsViewDto;

      res.status(HTTP_STATUS_CODE.CREATED_201).json(result);
    } catch (error) {
      next(error);
    }
  };

  updateBlog = async (req: RequestWithParamsAndBody<UriParamsModel, BlogUpdateModal>, res: Response, next: NextFunction) => {
    try {
      await this.blogService.updateBlogById(req.params.id, req.body);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      next(error);
    }
  };

  deleteBlog = async (req: RequestWithParams<UriParamsModel>, res: Response, next: NextFunction) => {
    try {
      await this.blogService.deleteBlogById(req.params.id);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      next(error);
    }
  };

  createPostByBlog = async (req: RequestWithParamsAndBody<UriParamsModel, PostCreateModel>, res: Response<PostsViewDto>, next: NextFunction) => {
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
      next(error);
    }
  };

  getPostsByBLog = async (req: RequestWithQuery<UriParamsModel, queryStringType>, res: Response, next: NextFunction) => {
    try {
      const blogId = await this.blogService.findBlogById(req.params.id);
      const result = await this.postsQueryRepository.findPosts(req.query, req.authorizedUserId, blogId);

      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (error) {
      next(error);
    }
  };
}