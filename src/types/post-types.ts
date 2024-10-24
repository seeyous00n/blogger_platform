import { ObjectId } from 'mongodb';

export type PostType = {
  _id: ObjectId,
  title: string,
  shortDescription: string,
  content: string,
  blogId: ObjectId,
  blogName: string,
  createdAt: string
}

export type PostTypeId = {
  id: ObjectId,
  title: string,
  shortDescription: string,
  content: string,
  blogId: ObjectId,
  blogName: string,
  createdAt: string
}