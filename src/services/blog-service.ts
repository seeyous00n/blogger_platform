import { blogsRepository } from '../repositories/blogs-repository';
import { BlogType } from '../types/blog-types';
import { BlogCreateModel } from '../models/blog/BlogCreateModel';
import { BlogUpdateModal } from '../models/blog/BlogUpdateModal';
import { setAndThrowError } from '../utils';
import { HTTP_MESSAGE, HTTP_STATUS_CODE } from '../settings';

class BlogService {
  getAllBlogs(): BlogType[] {
    return blogsRepository.getAll();
  }

  getBlogById(id: number): BlogType {
    const result = blogsRepository.getById(id);
    if (!result) {
      throw new Error('blog id not found');
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
      setAndThrowError({ message: HTTP_MESSAGE.NOT_FOUND, status: HTTP_STATUS_CODE.NOT_FOUND_404 });
    }
    blogsRepository.updateById(id, data);
  }

  deleteBlogById(id: number): void {
    const result = blogsRepository.getById(id);
    if (!result) {
      setAndThrowError({ message: HTTP_MESSAGE.NOT_FOUND, status: HTTP_STATUS_CODE.NOT_FOUND_404 });
    }
    blogsRepository.deleteById(id);
  }
}

export const blogService = new BlogService();