import { BlogType } from '../types/blog-types';
import { blogsCollection } from '../db';
import { setAndThrowError } from '../utils';
import { HTTP_MESSAGE, HTTP_STATUS_CODE } from '../settings';
import { BlogsViewDto } from '../dtos/blogs-view-dto';

class BlogsQueryRepository {
  async findBlogs() {
    const result = await blogsCollection.find({}).toArray();

    return result.map((blog: BlogType) => new BlogsViewDto(blog));
  }

  async findById(id: string): Promise<BlogType> {
    const result = await blogsCollection.findOne({ id });
    if (!result) {
      setAndThrowError({ message: HTTP_MESSAGE.NOT_FOUND, status: HTTP_STATUS_CODE.NOT_FOUND_404 });
    }

    return new BlogsViewDto(result!);
  }
}

export const blogsQueryRepository = new BlogsQueryRepository();