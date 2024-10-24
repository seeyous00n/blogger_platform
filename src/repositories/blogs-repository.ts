import { BlogType } from '../types/blog-types';
import { BlogUpdateModal } from '../models/blog/BlogUpdateModal';
import { blogsCollection } from '../db';
import { ObjectId } from 'mongodb';

class BlogsRepository {
  async findById(_id: ObjectId) {
    return await blogsCollection.findOne({ _id });
  }

  async createByData(data: BlogType) {
    await blogsCollection.insertOne(data);
  }

  async updateById(_id: ObjectId, data: BlogUpdateModal) {
    await blogsCollection.updateOne(
      { _id },
      { $set: data },
    );
  }

  async deleteById(_id: ObjectId) {
    await blogsCollection.deleteOne({ _id });
  }
}

export const blogsRepository = new BlogsRepository();