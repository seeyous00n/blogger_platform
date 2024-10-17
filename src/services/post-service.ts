import { postsRepository } from '../repositories/posts-repository';
import { PostCreateModel } from '../models/post/PostCreateModel';
import { PostType } from '../types/post-types';
import { PostUpdateModal } from '../models/post/PostUpdateModal';
import { blogService } from './blog-service';
import { setAndThrowError } from '../utils';
import { HTTP_MESSAGE, HTTP_STATUS_CODE } from '../settings';



class PostService {
  getAllPosts(): PostType[] {
    return postsRepository.getAll();
  }

  getPostById(id: number): PostType | undefined {
    const result = postsRepository.getById(id);
    if (!result) {
      setAndThrowError({ message: HTTP_MESSAGE.NOT_FOUND, status: HTTP_STATUS_CODE.NOT_FOUND_404 });
    }
    return result;
  }

  createPost(post: PostCreateModel): PostType {
    const dataBlog = blogService.getBlogById(+post.blogId); // правильно ли из сервиса обращаться к другому сервису??
    const id = String(new Date().getTime());
    const newPost = { ...post, id, blogName: dataBlog.name };
    postsRepository.createByData(newPost);
    return newPost;
  }

  updatePostById(id: number, data: PostUpdateModal): void {
    const result = postsRepository.getById(id);
    if (!result) {
      setAndThrowError({ message: HTTP_MESSAGE.NOT_FOUND, status: HTTP_STATUS_CODE.NOT_FOUND_404 });
    }
    postsRepository.updateById(id, data);
  }

  deletePostById(id: number): void {
    const result = postsRepository.getById(id);

    if (!result) {
      setAndThrowError({ message: HTTP_MESSAGE.NOT_FOUND, status: HTTP_STATUS_CODE.NOT_FOUND_404 });
    }
    postsRepository.deleteById(id);
  }
}

export const postService = new PostService();