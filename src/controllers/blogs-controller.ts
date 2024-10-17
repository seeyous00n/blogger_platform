import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODE, HTTP_MESSAGE } from '../settings';
import { BlogViewModel } from '../models/blog/BlogViewModel';
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from '../types/types';
import { URIParamsModel } from '../models/URIParamsModel';
import { blogService } from '../services/blog-service';
import { BlogCreateModel } from '../models/blog/BlogCreateModel';
import { BlogUpdateModal } from '../models/blog/BlogUpdateModal';
import { BlogType } from '../types/blog-types';

class BlogsController {
  getBlogs = (req: Request, res: Response<BlogViewModel[] | string>, next: NextFunction) => {
    try {
      const result: BlogType[] = blogService.getAllBlogs();
      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (e: any) {
      res.status(HTTP_STATUS_CODE.SERVER_ERROR_500).json(HTTP_MESSAGE.SERVER_ERROR); // res: Response<BlogViewModel[] | string> ?????
    }
  };

  getBlog = (req: RequestWithParams<URIParamsModel>, res: Response<BlogViewModel | string>, next: NextFunction) => {
    try {
      const result: BlogType = blogService.getBlogById(+req.params.id);
      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (e: any) {
      const err = JSON.parse(e.message);
      res.status(err.status).json(err.message);
    }
  };

  createBlog = (req: RequestWithBody<BlogCreateModel>, res: Response<BlogViewModel | string>, next: NextFunction) => {
    try {
      const result: BlogType = blogService.createBlog(req.body);
      res.status(HTTP_STATUS_CODE.CREATED_201).json(result);
    } catch (e: any) {
      res.status(HTTP_STATUS_CODE.SERVER_ERROR_500).json(HTTP_MESSAGE.SERVER_ERROR);
    }
  };

  updateBlog = (req: RequestWithParamsAndBody<URIParamsModel, BlogUpdateModal>, res: Response, next: NextFunction) => {
    try {
      blogService.updateBlogById(+req.params.id, req.body);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (e: any) {
      const err = JSON.parse(e.message);
      res.status(err.status).json(err.message);
    }
  };

  deleteBlog = (req: RequestWithParams<URIParamsModel>, res: Response, next: NextFunction) => {
    try {
      blogService.deleteBlogById(+req.params.id);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (e: any) {
      const err = JSON.parse(e.message);
      res.status(err.status).json(err.message);
    }
  };
}

export const blogsController = new BlogsController();