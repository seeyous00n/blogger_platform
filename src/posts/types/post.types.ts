import { ObjectId } from 'mongodb';

export type PostEntityType = {
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
  blogName: string,
  createdAt: string,
}

export type PostViewType = PostEntityType & {
  _id: ObjectId
}

export type ExtendedLikesInfo = {
  likesCount: number,
  dislikesCount: number,
  myStatus: string
  newestLikes: newestLikes[]
}

export type newestLikes = {
  addedAt: string,
  userId: string,
  login: string,
}

export type PostViewForMapType = {
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
  blogName: string,
  createdAt: string,
  _id: ObjectId
  extendedLikesInfo: ExtendedLikesInfo
}

