import { PostType } from '../types/post-types';
import { PostUpdateModal } from '../models/post/PostUpdateModal';
import { postsCollection } from '../db';

class PostsRepository {
  async findById(id: string): Promise<PostType | null> {
    return await postsCollection.findOne({ id });
  }

  async createByData(data: PostType) {
    await postsCollection.insertOne(data);
  }

  async updateById(id: string, data: PostUpdateModal) {
    await postsCollection.updateOne(
      { id },
      { $set: data },
    );
  }

  async deleteById(id: string) {
    await postsCollection.deleteOne({ id });
  }
}

export const postsRepository = new PostsRepository();