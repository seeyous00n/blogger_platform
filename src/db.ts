import { MongoClient } from 'mongodb';
import { SETTINGS } from './common/settings';
import { BlogType } from './blogs/types/blog-types';
import { PostType } from './posts/types/post.types';
import { UserType } from './users/types/user.types';
import { CommentTypes } from './comments/types/comment-types';

const COLLECTION_BLOGS = 'blogs'
const COLLECTION_POSTS = 'posts'
const COLLECTION_USERS = 'users'
const COLLECTION_COMMENTS = 'comments'

const mongoURI = SETTINGS.MONGO_URI;
export const client = new MongoClient(mongoURI);

export const blogsCollection = client.db(SETTINGS.DB_NAME).collection<BlogType>(COLLECTION_BLOGS);
export const postsCollection = client.db(SETTINGS.DB_NAME).collection<PostType>(COLLECTION_POSTS);
export const usersCollection = client.db(SETTINGS.DB_NAME).collection<UserType>(COLLECTION_USERS);
export const commentsCollection = client.db(SETTINGS.DB_NAME).collection<CommentTypes>(COLLECTION_COMMENTS);

export const runDB = async () => {
  try {
    await client.connect();
    await client.db(SETTINGS.DB_NAME).command({ ping: 1 });
    console.log('Connected successfully to server..');
  } catch (e) {
    console.error('console.error', e);
    await client.close();
  }
};