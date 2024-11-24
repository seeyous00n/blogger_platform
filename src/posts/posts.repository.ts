import { PostEntityType } from './types/post.types';
import { PostUpdateModal } from './models/postUpdate.modal';
import { ObjectId, WithId } from 'mongodb';
import { isObjectId } from '../common/adapters/mongodb.service';
import { PostModel } from "../common/db/schemes/postSchema";
import { HydratedDocument } from "mongoose";
import { PostCreateModel } from "./models/postCreate.model";

class PostsRepository {
  async findById(id: string): Promise<WithId<PostEntityType> | null> {
    isObjectId(id);
    return PostModel.findOne({ _id: new ObjectId(id) });
  }

  async createByData(data: PostEntityType): Promise<HydratedDocument<PostCreateModel>> {
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

export const postsRepository = new PostsRepository();