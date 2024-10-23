import { BlogType } from '../types/blog-types';
import { blogsCollection } from '../db';
import { setAndThrowError } from '../utils';
import { HTTP_MESSAGE, HTTP_STATUS_CODE } from '../settings';
import { BlogsViewDto } from '../dtos/blogs-view-dto';
import { postsQueryRepository } from './posts-query-repository';
import { QueryStringFilter } from '../filters/query-string-filter';
import { queryStringType } from '../types/types';

class BlogsQueryRepository {
  async findBlogs(queryString: queryStringType, id: string | undefined) {
    if (id) {
      const blog = await blogsCollection.findOne({ id });
      if (!blog) {
        setAndThrowError({ message: HTTP_MESSAGE.NOT_FOUND, status: HTTP_STATUS_CODE.NOT_FOUND_404 });
      }

      return await postsQueryRepository.findPosts(queryString, id);
    }

    const supportFilter = new QueryStringFilter(queryString);
    const filter = supportFilter.prepareQueryString();
    const result = await blogsCollection
      .find(filter.search)
      .sort(filter.sort as {})
      .skip(filter.skip)
      .limit(filter.limit)
      .toArray();
    const blogsCount = await blogsCollection.countDocuments(filter.search);

    return supportFilter.prepareData(blogsCount, result);
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