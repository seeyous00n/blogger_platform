import { BlogEntityType } from './types/blog.types';
import { BlogUpdateModal } from './models/blogUpdate.modal';
import { ObjectId, WithId } from 'mongodb';
import { isObjectId } from '../common/adapters/mongodb.service';
import { BlogModel } from "../common/db/schemes/blogSchema";

class BlogsRepository {
  async findById(id: string): Promise<WithId<BlogEntityType> | null> {
    isObjectId(id);
    return BlogModel.findOne({ _id: new ObjectId(id) }).lean();
  }

  async createByData(data: BlogEntityType) {
    return await BlogModel.create(data);
  }

  async updateById(id: string, data: BlogUpdateModal): Promise<void> {
    await BlogModel.updateOne(
      { _id: new ObjectId(id) },
      { $set: data },
    );
  }

  async deleteById(id: string): Promise<void> {
    await BlogModel.deleteOne({ _id: new ObjectId(id) });
  }
}

export const blogsRepository = new BlogsRepository();