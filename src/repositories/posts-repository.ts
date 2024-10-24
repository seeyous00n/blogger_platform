import { PostType } from '../types/post-types';
import { PostUpdateModal } from '../models/post/PostUpdateModal';
import { postsCollection } from '../db';
import { ObjectId } from 'mongodb';

class PostsRepository {
  async findById(_id: ObjectId) {
    return await postsCollection.findOne({ _id });
  }

  async createByData(data: PostType) {
    await postsCollection.insertOne(data);
  }

  async updateById(_id: ObjectId, data: PostUpdateModal) {
    await postsCollection.updateOne(
      { _id },
      { $set: data },
    );
  }

  async deleteById(_id: ObjectId) {
    await postsCollection.deleteOne({ _id });
  }
}

export const postsRepository = new PostsRepository();