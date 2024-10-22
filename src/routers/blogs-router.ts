import { Router } from 'express';
import { blogsController } from '../controllers/blogs-controller';
import { blogDataValidation, postDataValidation, postDataValidationWithoutId } from '../validations/data-validation';
import { authValidationMiddleware } from '../middlewares/auth-validation-middleware';

const blogsRouter = Router();

blogsRouter.get('/', blogsController.getBlogs);
blogsRouter.get('/:id', blogsController.getBlog);
blogsRouter.get('/:id/posts', blogsController.getBlogs);
blogsRouter.post('/', authValidationMiddleware, blogDataValidation, blogsController.createBlog);
blogsRouter.post('/:id/posts', authValidationMiddleware, postDataValidationWithoutId, blogsController.createPost);
blogsRouter.put('/:id', authValidationMiddleware, blogDataValidation, blogsController.updateBlog);
blogsRouter.delete('/:id', authValidationMiddleware, blogsController.deleteBlog);

export { blogsRouter };