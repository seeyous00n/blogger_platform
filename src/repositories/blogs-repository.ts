import { BlogType } from '../types/blog-types';
import { BlogUpdateModal } from '../models/blog/BlogUpdateModal';
import { blogsCollection } from '../db';
import { ObjectId } from 'mongodb';

class BlogsRepository {
  async findById(id: string) {
    try {
      return await blogsCollection.findOne({ _id: new ObjectId(id) });
    } catch (e) {
      return;
    }
  }

  async createByData(data: BlogType) {
    return await blogsCollection.insertOne(data);
  }

  async updateById(id: string, data: BlogUpdateModal) {
    await blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: data },
    );
  }

  async deleteById(id: string) {
    await blogsCollection.deleteOne({ _id: new ObjectId(id) });
  }
}

export const blogsRepository = new BlogsRepository();