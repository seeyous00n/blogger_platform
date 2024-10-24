import { blogsRepository } from '../repositories/blogs-repository';
import { BlogType } from '../types/blog-types';
import { BlogCreateModel } from '../models/blog/BlogCreateModel';
import { BlogUpdateModal } from '../models/blog/BlogUpdateModal';
import { setAndThrowError } from '../utils';
import { HTTP_MESSAGE, HTTP_STATUS_CODE } from '../settings';
import { BlogsViewDto } from '../dtos/blogs-view-dto';
import { postService } from './post-service';
import { PostCreateModel } from '../models/post/PostCreateModel';
import { ObjectId } from 'mongodb';

class BlogService {
  async findBlogById(id: ObjectId): Promise<BlogType> {
    const result = await blogsRepository.findById(id);
    if (!result) {
      setAndThrowError({ message: HTTP_MESSAGE.NOT_FOUND, status: HTTP_STATUS_CODE.NOT_FOUND_404 });
    }

    return result!;
  }

  async createBlog(blog: BlogCreateModel): Promise<BlogType> {
    const id = new ObjectId();
    const newBlog = {
      ...blog, id, isMembership: false, createdAt: new Date().toISOString(),
    };
    await blogsRepository.createByData(newBlog);
    const result = await blogsRepository.findById(id);

    if (!result) {
      throw new Error();
    }

    return new BlogsViewDto(result);
  }

  async updateBlogById(_id: string, data: BlogUpdateModal): Promise<void> {
    const id = new ObjectId(_id);
    const result = await blogsRepository.findById(id);
    if (!result) {
      setAndThrowError({ message: HTTP_MESSAGE.NOT_FOUND, status: HTTP_STATUS_CODE.NOT_FOUND_404 });
    }
    await blogsRepository.updateById(id, data);
  }

  async deleteBlogById(_id: string): Promise<void> {
    const id = new ObjectId(_id);
    const result = await blogsRepository.findById(id);
    if (!result) {
      setAndThrowError({ message: HTTP_MESSAGE.NOT_FOUND, status: HTTP_STATUS_CODE.NOT_FOUND_404 });
    }
    await blogsRepository.deleteById(id);
  }

  async createPost(post: PostCreateModel, _id: string) {
    post.blogId = new ObjectId(_id);
    return await postService.createPost(post);
  }
}

export const blogService = new BlogService();