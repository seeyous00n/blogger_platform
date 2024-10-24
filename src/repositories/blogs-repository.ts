import { BlogType } from '../types/blog-types';
import { BlogUpdateModal } from '../models/blog/BlogUpdateModal';
import { blogsCollection } from '../db';
import { ObjectId } from 'mongodb';

class BlogsRepository {
  async findById(id: ObjectId): Promise<BlogType | null> {
    return await blogsCollection.findOne({ id });
  }

  async createByData(data: BlogType) {
    await blogsCollection.insertOne(data);
  }

  async updateById(id: ObjectId, data: BlogUpdateModal) {
    await blogsCollection.updateOne(
      { id },
      { $set: data },
    );
  }

  async deleteById(id: ObjectId) {
    await blogsCollection.deleteOne({ id });
  }
}

export const blogsRepository = new BlogsRepository();