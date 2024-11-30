import { Router } from 'express';
import { blogDataValidation, postDataValidationWithoutId } from '../common/validation/data.validation';
import { authBaseGuard } from '../common/middlewares/guards/authBase.guard';
import {
  queryStringPaginationPostsValidation,
  queryStringPaginationValidation
} from '../common/validation/queryStringPagination.validation';
import { blogsController } from "../composition-root";
import { isUserAuthorized } from "../common/middlewares/isUserAuthorized";

const blogsRouter = Router();

blogsRouter.get('/', queryStringPaginationValidation, blogsController.getBlogs);
blogsRouter.get('/:id', blogsController.getBlog);
blogsRouter.get('/:id/posts', isUserAuthorized, queryStringPaginationPostsValidation, blogsController.getPostsByBLog);
blogsRouter.post('/', authBaseGuard, blogDataValidation, blogsController.createBlog);
blogsRouter.post('/:id/posts', authBaseGuard, postDataValidationWithoutId, blogsController.createPostByBlog);
blogsRouter.put('/:id', authBaseGuard, blogDataValidation, blogsController.updateBlog);
blogsRouter.delete('/:id', authBaseGuard, blogsController.deleteBlog);

export { blogsRouter };