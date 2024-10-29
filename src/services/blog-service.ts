import { blogsRepository } from '../repositories/blogs-repository';
import { BlogCreateModel } from '../models/blog/BlogCreateModel';
import { BlogUpdateModal } from '../models/blog/BlogUpdateModal';
import { NotFoundError } from '../utils/error-handler';
import { InsertOneResult, ObjectId } from 'mongodb';
import { ERROR_MESSAGE } from '../types/types';
import { BlogType } from '../types/blog-types';

class BlogService {
  async findBlogById(id: string) {
    const result = await this.isExistsBlog(id);

    return result._id;
  }

  async createBlog(blog: BlogCreateModel): Promise<InsertOneResult<BlogType>> {
    const newBlog = {
      ...blog, _id: new ObjectId(), isMembership: false, createdAt: new Date().toISOString(),
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
      throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND);
    }

    return result;
  }
}

export const blogService = new BlogService();