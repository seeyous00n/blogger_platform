import { LikesType } from "../../common/db/schemes/likesSchema";
import { ObjectId } from "mongodb";

export type ResultLikeType = {
  likesCount: number;
  dislikesCount: number;
}

export type LikeWithMyStatusType = ResultLikeType & { myStatus: string }

export type LikesTypeWithId = LikesType & { _id: ObjectId, __v: number }