import { Router } from 'express';
import { blogsController } from './blogs-controller';
import { blogDataValidation, postDataValidationWithoutId } from '../common/validation/dataValidation';
import { authBaseGuard } from '../common/middlewares/guards/authBase.guard';

const blogsRouter = Router();

blogsRouter.get('/', blogsController.getBlogs);
blogsRouter.get('/:id', blogsController.getBlog);
blogsRouter.get('/:id/posts', blogsController.getPostsFromBLog);
blogsRouter.post('/', authBaseGuard, blogDataValidation, blogsController.createBlog);
blogsRouter.post('/:id/posts', authBaseGuard, postDataValidationWithoutId, blogsController.createPostFromBlog);
blogsRouter.put('/:id', authBaseGuard, blogDataValidation, blogsController.updateBlog);
blogsRouter.delete('/:id', authBaseGuard, blogsController.deleteBlog);

export { blogsRouter };