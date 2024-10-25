import { postsRepository } from '../repositories/posts-repository';
import { PostCreateModel } from '../models/post/PostCreateModel';
import { PostUpdateModal } from '../models/post/PostUpdateModal';
import { blogService } from './blog-service';
import { NotFoundError } from '../utils/utils';
import { PostsViewDto } from '../dtos/posts-view-dto';
import { ObjectId } from 'mongodb';
import { ERROR_MESSAGE } from '../types/types';

class PostService {
  async createPost(post: PostCreateModel) {
    const dataBlog = await blogService.findBlogById(post.blogId.toString());
    post.blogId = new ObjectId(dataBlog._id);
    const newPost = {
      ...post, _id: new ObjectId(), blogName: dataBlog.name, createdAt: new Date().toISOString(),
    };

    const createdPost = await postsRepository.createByData(newPost);
    const result = await postsRepository.findById(createdPost.insertedId.toString());

    if (!result) {
      throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND);
    }

    return new PostsViewDto(result);
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