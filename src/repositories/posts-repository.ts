import { db } from '../db';
import { PostType } from '../types/post-types';
import { PostUpdateModal } from '../models/post/PostUpdateModal';

class PostsRepository {
  getAll() {
    return db.posts;
  }

  getById(id: number): PostType | undefined {
    return db.posts.find((post) => +post.id === id);
  }

  createByData(data: PostType) {
    db.posts.push(data);
  }

  updateById(id: number, data: PostUpdateModal) {
    const index = db.posts.findIndex(post => +post.id === id);
    db.posts[index] = { ...db.posts[index], ...data };
  }

  deleteById(id: number) {
    db.posts = db.posts.filter(post => +post.id !== id);
  }
}

export const postsRepository = new PostsRepository();