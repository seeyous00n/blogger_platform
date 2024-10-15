import { db } from '../db';
import { BlogType } from '../types/blog-types';
import { BlogUpdateModal } from '../models/blog/BlogUpdateModal';

class BlogsRepository {
  getAll() {
    return db.blogs;
  }

  getById(id: number): BlogType | undefined {
    return db.blogs.find((blog) => +blog.id === id);
  }

  createByData(data: BlogType) {
    db.blogs.push(data);
  }

  deleteById(id: number) {
    db.blogs = db.blogs.filter(blog => +blog.id !== id);
  }

  updateById(id: number, data: BlogUpdateModal) {
    const index = db.blogs.findIndex(blog => +blog.id === id);
    db.blogs[index] = { ...db.blogs[index], ...data };
  }
}

export const blogsRepository = new BlogsRepository();