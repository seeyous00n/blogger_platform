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