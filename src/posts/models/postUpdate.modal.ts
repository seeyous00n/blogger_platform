import { ObjectId } from 'mongodb';

export type PostUpdateModal = {
  title: string,
  shortDescription: string,
  content: string,
  blogId: ObjectId
}