import { PostType } from '../types/post-types';
import { PostUpdateModal } from '../models/post/PostUpdateModal';
import { postsCollection } from '../db';
import { ObjectId } from 'mongodb';

class PostsRepository {
  async findById(id: ObjectId): Promise<PostType | null> {
    return await postsCollection.findOne({ id });
  }

  async createByData(data: PostType) {
    await postsCollection.insertOne(data);
  }

  async updateById(id: ObjectId, data: PostUpdateModal) {
    await postsCollection.updateOne(
      { id },
      { $set: data },
    );
  }

  async deleteById(id: ObjectId) {
    await postsCollection.deleteOne({ id });
  }
}

export const postsRepository = new PostsRepository();