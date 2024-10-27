import { blogsRepository } from '../repositories/blogs-repository';
import { BlogCreateModel } from '../models/blog/BlogCreateModel';
import { BlogUpdateModal } from '../models/blog/BlogUpdateModal';
import { NotFoundError } from '../utils/error-handler';
import { postService } from './post-service';
import { PostCreateModel } from '../models/post/PostCreateModel';
import { ObjectId } from 'mongodb';
import { ERROR_MESSAGE } from '../types/types';

class BlogService {
  async findBlogById(id: string) {
    const result = await blogsRepository.findById(id);
    if (!result) {
      throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND);
    }

    return result;
  }

  async createBlog(blog: BlogCreateModel) {
    const newBlog = {
      ...blog, _id: new ObjectId(), isMembership: false, createdAt: new Date().toISOString(),
    };

    return await blogsRepository.createByData(newBlog);
  }

  async updateBlogById(id: string, data: BlogUpdateModal): Promise<void> {
    const result = await blogsRepository.findById(id);
    if (!result) {
      throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND);
    }
    await blogsRepository.updateById(id, data);
  }

  async deleteBlogById(id: string): Promise<void> {
    const result = await blogsRepository.findById(id);
    if (!result) {
      throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND);
    }
    await blogsRepository.deleteById(id);
  }

  async createPost(post: PostCreateModel, id: string) {
    post.blogId = id;
    return await postService.createPost(post);
  }
}

export const blogService = new BlogService();