import { postsRepository } from './posts.repository';
import { PostCreateModel } from './models/postCreate.model';
import { PostUpdateModal } from './models/postUpdate.modal';
import { CustomError, TYPE_ERROR } from '../common/errorHandler';
import { PostEntityType } from './types/post.types';
import { blogsRepository } from '../blogs/blogs.repository';
import { ObjectId } from 'mongodb';

class PostService {
  async findPostById(id: string): Promise<ObjectId> {
    const result = await postsRepository.findById(id);
    if (!result) {
      throw new CustomError(TYPE_ERROR.NOT_FOUND);
    }

    return result._id;
  }

  async createPost(post: PostCreateModel) {
    const dataBlog = await blogsRepository.findById(post.blogId.toString());
    if (!dataBlog) {
      throw new CustomError(TYPE_ERROR.NOT_FOUND);
    }

    const newPost: PostEntityType = {
      ...post,
      blogId: dataBlog._id.toString(),
      blogName: dataBlog.name,
      createdAt: new Date().toISOString(),
    };

    return await postsRepository.createByData(newPost);
  }

  async updatePostById(id: string, data: PostUpdateModal): Promise<void> {
    await this.checkExistsPost(id);
    await postsRepository.updateById(id, data);
  }

  async deletePostById(id: string): Promise<void> {
    await this.checkExistsPost(id);
    await postsRepository.deleteById(id);
  }

  async checkExistsPost(id: string): Promise<void> {
    const result = await postsRepository.findById(id);
    if (!result) {
      throw new CustomError(TYPE_ERROR.NOT_FOUND);
    }
  }
}

export const postService = new PostService();