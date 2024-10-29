import { PostType } from './types/post.types';
import { PostUpdateModal } from './models/postUpdate.modal';
import { postsCollection } from '../db';
import { ObjectId } from 'mongodb';
import { isObjectId } from '../common/adapters/mongodb.service';

class PostsRepository {
  async findById(id: string) {
    await isObjectId(id);
    return await postsCollection.findOne({ _id: new ObjectId(id) });
  }

  async createByData(data: PostType) {
    return await postsCollection.insertOne(data);
  }

  async updateById(id: string, data: PostUpdateModal) {
    await postsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: data },
    );
  }

  async deleteById(id: string) {
    await postsCollection.deleteOne({ _id: new ObjectId(id) });
  }
}

export const postsRepository = new PostsRepository();