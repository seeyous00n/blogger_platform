import { Router } from 'express';
import { postsController } from '../controllers/posts-controller';

const postsRouter = Router();

postsRouter.get('/', postsController.getPosts);
postsRouter.get('/:id', postsController.getPost);
postsRouter.post('/', postsController.creatPost);
postsRouter.put('/:id', postsController.updatePost);
postsRouter.delete('/:id', postsController.deletePost);

export { postsRouter };