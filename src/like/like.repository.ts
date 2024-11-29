import { LikesDocument, LikesModel, LikeStatusType, LikesType } from "../common/db/schemes/likesSchema";

export class LikeRepository {
  async findLikeByParentIdAndAuthorId(parentId: string, authorId: string): Promise<LikesDocument | null> {
    return LikesModel.findOne({ parentId: parentId, authorId: authorId });
  }

  async createLike(data: LikesType): Promise<LikesDocument> {
    return await LikesModel.create(data);
  }

  async getCount(parentId: string, status: LikeStatusType): Promise<number> {
    return LikesModel.countDocuments({ parentId, status });
  }
}