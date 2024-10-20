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
  getBlogs = async (req: Request, res: Response<BlogViewModel[] | string>, next: NextFunction) => {
    try {
      const result: BlogType[] = await blogService.findBLogs();
      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (e: any) {
      res.status(HTTP_STATUS_CODE.SERVER_ERROR_500).json(HTTP_MESSAGE.SERVER_ERROR); // res: Response<BlogViewModel[] | string> ?????
    }
  };

  getBlog = async (req: RequestWithParams<URIParamsModel>, res: Response<BlogViewModel>, next: NextFunction) => {
    try {
      const result: BlogType = await blogService.getBlogById(req.params.id);
      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (e: any) {
      const err = JSON.parse(e.message);
      res.status(err.status).json(err.message);
    }
  };

  createBlog = async (req: RequestWithBody<BlogCreateModel>, res: Response<BlogViewModel | string>, next: NextFunction) => {
    try {
      const result: BlogType = await blogService.createBlog(req.body);
      res.status(HTTP_STATUS_CODE.CREATED_201).json(result);
    } catch (e: any) {
      res.status(HTTP_STATUS_CODE.SERVER_ERROR_500).json(HTTP_MESSAGE.SERVER_ERROR);
    }
  };

  updateBlog = async (req: RequestWithParamsAndBody<URIParamsModel, BlogUpdateModal>, res: Response, next: NextFunction) => {
    try {
      await blogService.updateBlogById(req.params.id, req.body);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (e: any) {
      const err = JSON.parse(e.message);
      res.status(err.status).json(err.message);
    }
  };

  deleteBlog = async (req: RequestWithParams<URIParamsModel>, res: Response, next: NextFunction) => {
    try {
      await blogService.deleteBlogById(req.params.id);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (e: any) {
      const err = JSON.parse(e.message);
      res.status(err.status).json(err.message);
    }
  };
}

export const blogsController = new BlogsController();