import { blogsRepository } from './blogs.repository';
import { BlogCreateModel } from './models/blogCreate.model';
import { BlogUpdateModal } from './models/blogUpdate.modal';
import { CustomError, TYPE_ERROR } from '../common/errorHandler';

class BlogService {
  async findBlogById(id: string): Promise<string> {
    const result = await blogsRepository.findById(id);
    if (!result) {
      throw new CustomError(TYPE_ERROR.NOT_FOUND);
    }

    return result._id.toString();
  }

  async createBlog(blog: BlogCreateModel) {
    const newBlog = {
      ...blog, isMembership: false, createdAt: new Date().toISOString(),
    };

    return await blogsRepository.createByData(newBlog);
  }

  async updateBlogById(id: string, data: BlogUpdateModal): Promise<void> {
    await this.checkExistsBlog(id);
    await blogsRepository.updateById(id, data);
  }

  async deleteBlogById(id: string): Promise<void> {
    await this.checkExistsBlog(id);
    await blogsRepository.deleteById(id);
  }

  async checkExistsBlog(id: string): Promise<void> {
    const result = await blogsRepository.findById(id);
    if (!result) {
      throw new CustomError(TYPE_ERROR.NOT_FOUND);
    }
  }
}

export const blogService = new BlogService();