import { commentsCollection } from '../db';
import { InsertOneResult, ObjectId, UpdateResult, WithId } from 'mongodb';
import { isObjectId } from '../common/adapters/mongodb.service';
import { CommentEntityType } from './types/comment.types';

class CommentRepository {
  async findById(id: string): Promise<WithId<CommentEntityType> | null> {
    isObjectId(id);
    return await commentsCollection.findOne({ _id: new ObjectId(id) });
  }

  async findByIdAndUserId(id: string, userId: string): Promise<WithId<CommentEntityType> | null> {
    return await commentsCollection.findOne({ _id: new ObjectId(id), 'commentatorInfo.userId': userId });
  }

  async createByData(data: CommentEntityType): Promise<InsertOneResult<CommentEntityType>> {
    return await commentsCollection.insertOne(data);
  };

  async updateById(id: string, data: { content: string }): Promise<UpdateResult<CommentEntityType>> {
    return await commentsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: data },
    );
  }

  async deleteById(id: string): Promise<void> {
    await commentsCollection.deleteOne({ _id: new ObjectId(id) });
  }
}

export const commentRepository = new CommentRepository();