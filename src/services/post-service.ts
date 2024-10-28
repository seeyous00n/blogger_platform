import { postsRepository } from '../repositories/posts-repository';
import { PostCreateModel } from '../models/post/PostCreateModel';
import { PostUpdateModal } from '../models/post/PostUpdateModal';
import { NotFoundError } from '../utils/error-handler';
import { ObjectId } from 'mongodb';
import { ERROR_MESSAGE } from '../types/types';
import { PostType } from '../types/post-types';
import { blogsRepository } from '../repositories/blogs-repository';

class PostService {
  async createPost(post: PostCreateModel) {
    const dataBlog = await blogsRepository.findById(post.blogId.toString());
    if (!dataBlog) {
      throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND);
    }

    const newPost: PostType = {
      ...post,
      blogId: new ObjectId(dataBlog._id),
      _id: new ObjectId(),
      blogName: dataBlog.name,
      createdAt: new Date().toISOString(),
    };

    return await postsRepository.createByData(newPost);
  }

  async updatePostById(id: string, data: PostUpdateModal): Promise<void> {
    const result = await postsRepository.findById(id);
    if (!result) {
      throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND);
    }
    await postsRepository.updateById(id, data);
  }

  async deletePostById(id: string): Promise<void> {
    const result = await postsRepository.findById(id);
    if (!result) {
      throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND);
    }
    await postsRepository.deleteById(id);
  }
}

export const postService = new PostService();