import { LikesDocument, LikesModel, LikeStatusType, LikesType } from "../common/db/schemes/likesSchema";
import { LikesTypeWithId } from "./types/like.types";
import { LIKE } from "./like.service";

const MAX_LIMIT = 3;

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

  async findLikesWithLimit(id: string): Promise<LikesTypeWithId[]> {
    return LikesModel
      .find({ parentId: id, status: LIKE, isNewLike: 1 })
      .sort({ createdAt: -1 })
      .limit(MAX_LIMIT)
      .lean();
  }
}