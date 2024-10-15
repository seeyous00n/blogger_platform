import { blogsRepository } from '../repositories/blogs-repository';
import { BlogType } from '../types/blog-types';
import { BlogCreateModel } from '../models/blog/BlogCreateModel';
import { BlogUpdateModal } from '../models/blog/BlogUpdateModal';
import { BlogViewModel } from '../models/blog/BlogViewModel';

class BlogService {
  getAllBlogs(): BlogType[] {
    return blogsRepository.getAll();
  }

  getBlogById(id: number): BlogType {
    const result = blogsRepository.getById(id);
    if (!result) {
      throw new Error('Blog not found');
    }
    return result;
  }

  createBlog(blog: BlogCreateModel): BlogType {
    const id = String(new Date().getTime());
    const newBlog = { ...blog, id };
    blogsRepository.createByData(newBlog);
    return newBlog;
  }

  updateBlogById(id: number, data: BlogUpdateModal): void {
    const result = blogsRepository.getById(id);
    if (!result) {
      throw new Error('Blog not found');
    }
    blogsRepository.updateById(id, data);
  }

  deleteBlogById(id: number): void {
    const result = blogsRepository.getById(id);
    if (!result) {
      // тут по идеи нужно выкинуть ошибку
      throw new Error('Blog not found');
    }
    blogsRepository.deleteById(id);
  }
}

export const blogService = new BlogService();