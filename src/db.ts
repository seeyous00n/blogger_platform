import { MongoClient } from 'mongodb';
import { SETTINGS } from './common/settings';
import { BlogEntityType } from './blogs/types/blog.types';
import { PostEntityType } from './posts/types/post.types';
import { UserEntityType } from './users/types/user.types';
import { CommentEntityType } from './comments/types/comment.types';
import { TokenEntityType } from "./auth/types/token.type";

const COLLECTION_BLOGS = 'blogs';
const COLLECTION_POSTS = 'posts';
const COLLECTION_USERS = 'users';
const COLLECTION_COMMENTS = 'comments';
const COLLECTION_TOKENS = 'tokens';

const mongoURI = SETTINGS.MONGO_URI;
export const client = new MongoClient(mongoURI);

export const blogsCollection = client.db(SETTINGS.DB_NAME).collection<BlogEntityType>(COLLECTION_BLOGS);
export const postsCollection = client.db(SETTINGS.DB_NAME).collection<PostEntityType>(COLLECTION_POSTS);
export const usersCollection = client.db(SETTINGS.DB_NAME).collection<UserEntityType>(COLLECTION_USERS);
export const commentsCollection = client.db(SETTINGS.DB_NAME).collection<CommentEntityType>(COLLECTION_COMMENTS);
export const tokensCollection = client.db(SETTINGS.DB_NAME).collection<TokenEntityType>(COLLECTION_TOKENS);

export const runDB = async () => {
  try {
    await client.connect();
    await client.db(SETTINGS.DB_NAME).command({ ping: 1 });
    console.log('Connected successfully to server..');
  } catch (error) {
    console.error('console.error', error);
    await client.close();
  }
};