import { blogsRepository } from './blogs.repository';
import { BlogCreateModel } from './models/blogCreate.model';
import { BlogUpdateModal } from './models/blogUpdate.modal';
import { CustomError, NotFoundError, TYPE_ERROR } from '../common/errorHandler';
import { InsertOneResult } from 'mongodb';
import { ERROR_MESSAGE } from '../common/types/types';
import { BlogEntityType } from './types/blog.types';

class BlogService {
  async findBlogById(id: string) {
    const result = await this.isExistsBlog(id);

    return result._id.toString();
  }

  async createBlog(blog: BlogCreateModel): Promise<InsertOneResult<BlogEntityType>> {
    const newBlog = {
      ...blog, isMembership: false, createdAt: new Date().toISOString(),
    };

    return await blogsRepository.createByData(newBlog);
  }

  async updateBlogById(id: string, data: BlogUpdateModal): Promise<void> {
    await this.isExistsBlog(id);
    await blogsRepository.updateById(id, data);
  }

  async deleteBlogById(id: string): Promise<void> {
    await this.isExistsBlog(id);
    await blogsRepository.deleteById(id);
  }

  async isExistsBlog(id: string) {
    const result = await blogsRepository.findById(id);
    if (!result) {
      //throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND);
      throw new CustomError(TYPE_ERROR.NOT_FOUND, ERROR_MESSAGE.NOT_FOUND, []);
    }

    return result;
  }
}

export const blogService = new BlogService();