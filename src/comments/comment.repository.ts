import { ObjectId, WithId } from 'mongodb';
import { isObjectId } from '../common/adapters/mongodb.service';
import { CommentEntityType } from './types/comment.types';
import { CommentModel } from "../common/db/schemes/commentSchema";

class CommentRepository {
  async findById(id: string): Promise<WithId<CommentEntityType> | null> {
    isObjectId(id);
    return CommentModel.findOne({ _id: new ObjectId(id) }).lean();
  }

  async findByIdAndUserId(id: string, userId: string): Promise<WithId<CommentEntityType> | null> {
    return CommentModel.findOne({ _id: new ObjectId(id), 'commentatorInfo.userId': userId }).lean();
  }

  async createByData(data: CommentEntityType) {
    return await CommentModel.create(data);
  };

  async updateById(id: string, data: { content: string }): Promise<void> {
    await CommentModel.updateOne(
      { _id: new ObjectId(id) },
      { $set: data },
    );
  }

  async deleteById(id: string): Promise<void> {
    await CommentModel.deleteOne({ _id: new ObjectId(id) });
  }
}

export const commentRepository = new CommentRepository();