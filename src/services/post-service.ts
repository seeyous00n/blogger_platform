import { postsRepository } from '../repositories/posts-repository';
import { PostCreateModel } from '../models/post/PostCreateModel';
import { PostUpdateModal } from '../models/post/PostUpdateModal';
import { blogService } from './blog-service';
import { setAndThrowError } from '../utils';
import { HTTP_MESSAGE, HTTP_STATUS_CODE } from '../settings';
import { PostsViewDto } from '../dtos/posts-view-dto';
import { ObjectId } from 'mongodb';

class PostService {
  async createPost(post: PostCreateModel) {
    const dataBlog = await blogService.findBlogById(new ObjectId(post.blogId));
    const _id = new ObjectId();
    post.blogId = dataBlog._id;
    const newPost = {
      ...post, _id, blogName: dataBlog.name, createdAt: new Date().toISOString(),
    };
    await postsRepository.createByData(newPost);
    const result = await postsRepository.findById(_id);

    if (!result) {
      setAndThrowError({ message: HTTP_MESSAGE.NOT_FOUND, status: HTTP_STATUS_CODE.NOT_FOUND_404 });
    }

    return new PostsViewDto(result!);
  }

  async updatePostById(_id: string, data: PostUpdateModal): Promise<void> {
    const id = new ObjectId(_id);
    const result = await postsRepository.findById(id);
    if (!result) {
      setAndThrowError({ message: HTTP_MESSAGE.NOT_FOUND, status: HTTP_STATUS_CODE.NOT_FOUND_404 });
    }
    await postsRepository.updateById(id, data);
  }

  async deletePostById(_id: string): Promise<void> {
    const id = new ObjectId(_id);
    const result = await postsRepository.findById(id);
    if (!result) {
      setAndThrowError({ message: HTTP_MESSAGE.NOT_FOUND, status: HTTP_STATUS_CODE.NOT_FOUND_404 });
    }
    await postsRepository.deleteById(id);
  }
}

export const postService = new PostService();