import { ObjectId } from 'mongodb';

export type PostCreateModel = {
  title: string,
  shortDescription: string,
  content: string,
  blogId: ObjectId
}