import { LikesDocument, LikesModel, LikesType } from "../common/db/schemes/likesSchema";

export class LikeRepository {
  async getLikeByParentIdAuthorId(parentId: string, authorId: string): Promise<LikesDocument | null> {
    return LikesModel.findOne({ parentId: parentId, authorId: authorId });
  }

  async createLike(data: LikesType): Promise<LikesDocument> {
    return await LikesModel.create(data);
  }
}