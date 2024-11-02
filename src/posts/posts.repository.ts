import { PostEntityType } from './types/post.types';
import { PostUpdateModal } from './models/postUpdate.modal';
import { postsCollection } from '../db';
import { InsertOneResult, ObjectId, WithId } from 'mongodb';
import { isObjectId } from '../common/adapters/mongodb.service';

class PostsRepository {
  async findById(id: string): Promise<WithId<PostEntityType> | null> {
    isObjectId(id);
    return await postsCollection.findOne({ _id: new ObjectId(id) });
  }

  async createByData(data: PostEntityType): Promise<InsertOneResult<PostEntityType>> {
    return await postsCollection.insertOne(data);
  }

  async updateById(id: string, data: PostUpdateModal): Promise<void> {
    await postsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: data },
    );
  }

  async deleteById(id: string): Promise<void> {
    await postsCollection.deleteOne({ _id: new ObjectId(id) });
  }
}

export const postsRepository = new PostsRepository();