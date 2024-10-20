import { MongoClient } from 'mongodb';
import { SETTINGS } from './settings';
import { BlogType } from './types/blog-types';
import { PostType } from './types/post-types';

const mongoURI = SETTINGS.MONGO_URI;
const client = new MongoClient(mongoURI);

export const blogsCollection = client.db(SETTINGS.DB_NAME).collection<BlogType>('blogs');
export const postsCollection = client.db(SETTINGS.DB_NAME).collection<PostType>('posts');

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