import { blogsRepository } from '../repositories/blogs-repository';
import { BlogCreateModel } from '../models/blog/BlogCreateModel';
import { BlogUpdateModal } from '../models/blog/BlogUpdateModal';
import { NotFoundError } from '../utils/error-handler';
import { BlogsViewDto } from '../dtos/blogs-view-dto';
import { postService } from './post-service';
import { PostCreateModel } from '../models/post/PostCreateModel';
import { ObjectId } from 'mongodb';
import { ERROR_MESSAGE } from '../types/types';

class BlogService {
  async findBlogById(_id: string) {
    const result = await blogsRepository.findById(_id);
    if (!result) {
      throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND);
    }

    return result;
  }

  async createBlog(blog: BlogCreateModel) {
    const newBlog = {
      ...blog, _id: new ObjectId(), isMembership: false, createdAt: new Date().toISOString(),
    };
    const createdBlog = await blogsRepository.createByData(newBlog);
    const result = await blogsRepository.findById(createdBlog.insertedId.toString());

    if (!result) {
      throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND);
    }

    return new BlogsViewDto(result);
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

  async createPost(post: PostCreateModel, _id: string) {
    try {
      post.blogId = new ObjectId(_id);
      return await postService.createPost(post);
    } catch (e) {
      throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND);
    }
  }
}

export const blogService = new BlogService();