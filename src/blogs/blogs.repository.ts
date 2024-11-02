import { BlogEntityType } from './types/blog.types';
import { BlogUpdateModal } from './models/blogUpdate.modal';
import { blogsCollection } from '../db';
import { InsertOneResult, ObjectId, WithId } from 'mongodb';
import { isObjectId } from '../common/adapters/mongodb.service';

class BlogsRepository {
  async findById(id: string): Promise<WithId<BlogEntityType> | null> {
    isObjectId(id);
    return await blogsCollection.findOne({ _id: new ObjectId(id) });
  }

  async createByData(data: BlogEntityType): Promise<InsertOneResult<BlogEntityType>> {
    return await blogsCollection.insertOne(data);
  }

  async updateById(id: string, data: BlogUpdateModal): Promise<void> {
    await blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: data },
    );
  }

  async deleteById(id: string): Promise<void> {
    await blogsCollection.deleteOne({ _id: new ObjectId(id) });
  }
}

export const blogsRepository = new BlogsRepository();