import { BlogType } from './types/blog-types';
import { PostType } from './types/post-types';

export type DBType = {
  blogs: BlogType[],
  posts: PostType[]
}

export const db: DBType = {
  blogs: [],
  posts: [],
};

export const clearDbBlogs = () => db.blogs = []
export const clearDbPosts = () => db.posts = []