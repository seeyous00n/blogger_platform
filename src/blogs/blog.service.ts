import { blogsRepository } from './blogs.repository';
import { BlogCreateModel } from './models/blogCreate.model';
import { BlogUpdateModal } from './models/blogUpdate.modal';
import { CustomError, TYPE_ERROR } from '../common/errorHandler';
import { InsertOneResult } from 'mongodb';
import { ERROR_MESSAGE } from '../common/types/types';
import { BlogEntityType } from './types/blog.types';

class BlogService {
  async findBlogById(id: string): Promise<string> {
    const result = await blogsRepository.findById(id);
    if (!result) {
      throw new CustomError(TYPE_ERROR.NOT_FOUND, ERROR_MESSAGE.NOT_FOUND);
    }

    return result._id.toString();
  }

  async createBlog(blog: BlogCreateModel): Promise<InsertOneResult<BlogEntityType>> {
    const newBlog = {
      ...blog, isMembership: false, createdAt: new Date().toISOString(),
    };

    return await blogsRepository.createByData(newBlog);
  }

  async updateBlogById(id: string, data: BlogUpdateModal): Promise<void> {
    await this.existsBlogOrError(id);
    await blogsRepository.updateById(id, data);
  }

  async deleteBlogById(id: string): Promise<void> {
    await this.existsBlogOrError(id);
    await blogsRepository.deleteById(id);
  }

  async existsBlogOrError(id: string): Promise<void> {
    const result = await blogsRepository.findById(id);
    if (!result) {
      throw new CustomError(TYPE_ERROR.NOT_FOUND, ERROR_MESSAGE.NOT_FOUND);
    }
  }
}

export const blogService = new BlogService();