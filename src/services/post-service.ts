import { postsRepository } from '../repositories/posts-repository';
import { PostCreateModel } from '../models/post/PostCreateModel';
import { PostType } from '../types/post-types';
import { PostUpdateModal } from '../models/post/PostUpdateModal';
import { blogService } from './blog-service';
import { setAndThrowError } from '../utils';
import { HTTP_MESSAGE, HTTP_STATUS_CODE } from '../settings';
import { PostsViewDto } from '../dtos/posts-view-dto';

class PostService {
  async createPost(post: PostCreateModel): Promise<PostType> {
    const dataBlog = await blogService.findBlogById(post.blogId); // правильно ли из сервиса обращаться к другому сервису??
    const id = String(new Date().getTime());
    const newPost = {
      ...post, id, blogName: dataBlog.name, createdAt: new Date().toISOString(),
    };
    await postsRepository.createByData(newPost);
    const result = await postsRepository.findById(id);

    if (!result) {
      setAndThrowError({ message: HTTP_MESSAGE.NOT_FOUND, status: HTTP_STATUS_CODE.NOT_FOUND_404 });
    }

    return new PostsViewDto(result!);
  }

  async updatePostById(id: string, data: PostUpdateModal): Promise<void> {
    const result = await postsRepository.findById(id);
    if (!result) {
      setAndThrowError({ message: HTTP_MESSAGE.NOT_FOUND, status: HTTP_STATUS_CODE.NOT_FOUND_404 });
    }
    await postsRepository.updateById(id, data);
  }

  async deletePostById(id: string): Promise<void> {
    const result = await postsRepository.findById(id);

    if (!result) {
      setAndThrowError({ message: HTTP_MESSAGE.NOT_FOUND, status: HTTP_STATUS_CODE.NOT_FOUND_404 });
    }
    await postsRepository.deleteById(id);
  }
}

export const postService = new PostService();