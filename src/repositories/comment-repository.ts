import { commentsCollection } from '../db';
import { ObjectId } from 'mongodb';
import { CommentCreateModel } from '../models/comment/CommentCreateModel';
import { isObjectId } from '../utils/utils';

class CommentRepository {
  async findById(id: string) {
    await isObjectId(id);
    return await commentsCollection.findOne({ _id: new ObjectId(id) });
  }

  async findByIdAndUserId(id: string, userId: string) {
    return await commentsCollection.findOne({ _id: new ObjectId(id), 'commentatorInfo.userId': userId });
  }

  async createByData(data: CommentCreateModel) {
    return await commentsCollection.insertOne(data);
  };

  async updateById(id: string, data: { content: string }) {
    return await commentsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: data },
    );
  }

  async deleteById(id: string) {
    await commentsCollection.deleteOne({ _id: new ObjectId(id) });
  }
}

export const commentRepository = new CommentRepository();