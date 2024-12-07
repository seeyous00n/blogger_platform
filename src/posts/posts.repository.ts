import { PostEntityType } from './types/post.types';
import { PostUpdateModal } from './models/postUpdate.modal';
import { ObjectId, WithId } from 'mongodb';
import { isObjectId } from '../common/adapters/mongodb.service';
import { PostDocument, PostModel } from "../common/db/schemes/postSchema";
import { injectable } from "inversify";

@injectable()
export class PostsRepository {
  async findById(id: string): Promise<WithId<PostEntityType> | null> {
    isObjectId(id);
    return PostModel.findOne({ _id: new ObjectId(id) }).lean();
  }

  async createByData(data: PostEntityType): Promise<PostDocument> {
    return await PostModel.create(data);
  }

  async updateById(id: string, data: PostUpdateModal): Promise<void> {
    await PostModel.updateOne(
      { _id: new ObjectId(id) },
      { $set: data },
    );
  }

  async deleteById(id: string): Promise<void> {
    await PostModel.deleteOne({ _id: new ObjectId(id) });
  }
}