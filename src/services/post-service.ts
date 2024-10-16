import { postsRepository } from '../repositories/posts-repository';
import { PostCreateModel } from '../models/post/PostCreateModel';
import { PostType } from '../types/post-types';
import { PostUpdateModal } from '../models/post/PostUpdateModal';
import { blogService } from './blog-service';

class PostService {
  getAllPosts(): PostType[] {
    return postsRepository.getAll();
  }

  getPostById(id: number): PostType {
    const result = postsRepository.getById(id);
    if (!result) {
      throw new Error('Post not found');
    }
    return result;
  }

  createPost(post: PostCreateModel): PostType {
    const dataBlog = blogService.getBlogById(+post.blogId); // правильно ли из сервиса обращаться к другому сервису??
    const id = String(new Date().getTime());
    if (!dataBlog) {
      throw new Error('Blog name not found');
    }
    const newPost = { ...post, id, blogName: dataBlog.name };
    postsRepository.createByData(newPost);
    return newPost;
  }

  updatePostById(id: number, data: PostUpdateModal): void {
    const result = postsRepository.getById(id);
    if (!result) {
      throw new Error('Post not found');
    }
    postsRepository.updateById(id, data);
  }

  deletePostById(id: number): void {
    const result = postsRepository.getById(id);
    if (!result) {
      throw new Error('Post not found');
    }
    postsRepository.deleteById(id);
  }
}

export const postService = new PostService();