import { BlogType } from '../types/blog-types';
import { BlogUpdateModal } from '../models/blog/BlogUpdateModal';
import { blogsCollection } from '../db';

class BlogsRepository {
  async getAll() {
    return blogsCollection.find({}).toArray();
  }

  async getById(id: string): Promise<BlogType | null> {
    return await blogsCollection.findOne({ id });
  }

  async createByData(data: BlogType) {
    await blogsCollection.insertOne(data);
  }

  async updateById(id: string, data: BlogUpdateModal) {
    await blogsCollection.updateOne(
      { id },
      { $set: data },
    );
  }

  async deleteById(id: string) {
    await blogsCollection.deleteOne({ id });
  }
}

export const blogsRepository = new BlogsRepository();