import { BlogType } from '../types/blog-types';
import { BlogUpdateModal } from '../models/blog/BlogUpdateModal';
import { blogsCollection } from '../db';
import { ObjectId } from 'mongodb';

class BlogsRepository {
  async findById(_id: string) {
    try {
      return await blogsCollection.findOne({ _id: new ObjectId(_id) });
    } catch (e) {
      return;
    }
  }

  async createByData(data: BlogType) {
    return await blogsCollection.insertOne(data);
  }

  async updateById(_id: string, data: BlogUpdateModal) {
    await blogsCollection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: data },
    );
  }

  async deleteById(_id: string) {
    await blogsCollection.deleteOne({ _id: new ObjectId(_id) });
  }
}

export const blogsRepository = new BlogsRepository();