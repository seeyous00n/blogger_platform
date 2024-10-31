import { postsRepository } from './posts.repository';
import { PostCreateModel } from './models/postCreate.model';
import { PostUpdateModal } from './models/postUpdate.modal';
import { NotFoundError } from '../common/errorHandler';
import { ERROR_MESSAGE } from '../common/types/types';
import { PostEntityType } from './types/post.types';
import { blogsRepository } from '../blogs/blogs.repository';

class PostService {
  async findPostById(id: string) {
    const result = await this.isExistsPos(id);
    return result._id;
  }

  async createPost(post: PostCreateModel) {
    const dataBlog = await blogsRepository.findById(post.blogId.toString());
    if (!dataBlog) {
      throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND);
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
    await this.isExistsPos(id);
    await postsRepository.updateById(id, data);
  }

  async deletePostById(id: string): Promise<void> {
    await this.isExistsPos(id);
    await postsRepository.deleteById(id);
  }

  async isExistsPos(id: string) {
    const result = await postsRepository.findById(id);
    if (!result) {
      throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND);
    }

    return result;
  }
}

export const postService = new PostService();