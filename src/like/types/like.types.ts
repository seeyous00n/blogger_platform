import { LikesType } from "../../common/db/schemes/likesSchema";
import { ObjectId } from "mongodb";

export type ResultLikeType = {
  likesCount: number;
  dislikesCount: number;
}

export type LikeWithMyStatusType = ResultLikeType & { myStatus: string }

export type LikesWithIdType = LikesType & { _id: ObjectId, __v: number }

type NewestType = { addedAt: string, userId: string, login: string }

export type LikeWithNewestType = {
  likesCount: number
  dislikesCount: number
  myStatus: string
  newestLikes: NewestType[]
}

type LikeInfoType = {
  likesCount: number
  dislikesCount: number
  myStatus: string
}

export type LikesObjectStructType = {
  [key: string]: LikeInfoType
}

export type LikesObjectWithNewestStructType = {
  [key: string]: LikeWithNewestType
}