import { ObjectId } from 'mongodb';

export type BlogEntityType = {
  name: string,
  description: string,
  websiteUrl: string,
  createdAt: string,
  isMembership: boolean
}

export type BlogViewType = BlogEntityType & {
  _id: ObjectId
}