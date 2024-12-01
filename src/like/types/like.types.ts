import { LikesType } from "../../common/db/schemes/likesSchema";
import { ObjectId } from "mongodb";

export type ResultLikeType = {
  likesCount: number;
  dislikesCount: number;
}

export type LikeWithMyStatusType = ResultLikeType & { myStatus: string }

export type LikesWithIdType = LikesType & { _id: ObjectId, __v: number }

type NewestType = { addedAt: string, userId: string, login: string }
export type LikeWithNewestType = LikeWithMyStatusType & { newestLikes: NewestType[] }