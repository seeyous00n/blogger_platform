import { PostType } from '../types/post-types';
import { PostUpdateModal } from '../models/post/PostUpdateModal';
import { postsCollection } from '../db';
import { ObjectId } from 'mongodb';

class PostsRepository {
  async findById(_id: string) {
    try {
      return await postsCollection.findOne({ _id: new ObjectId(_id) });
    } catch (e) {
      return;
    }
  }

  async createByData(data: PostType) {
    return await postsCollection.insertOne(data);
  }

  async updateById(_id: string, data: PostUpdateModal) {
    await postsCollection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: data },
    );
  }

  async deleteById(_id: string) {
    await postsCollection.deleteOne({ _id: new ObjectId(_id) });
  }
}

export const postsRepository = new PostsRepository();