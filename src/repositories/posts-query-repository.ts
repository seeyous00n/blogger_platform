import { PostType } from '../types/post-types';
import { postsCollection } from '../db';
import { PostsViewDto } from '../dtos/posts-view-dto';
import { setAndThrowError } from '../utils';
import { HTTP_MESSAGE, HTTP_STATUS_CODE } from '../settings';
import { QueryStringFilter } from '../filters/query-string-filter';
import { queryStringType } from '../types/types';
import { blogsQueryRepository } from './blogs-query-repository';

class PostsQueryRepository {
  async findPosts(queryString: queryStringType, id?: string): Promise<any> {
    if (id) {
      const blog = await blogsQueryRepository.findById(id);
      if (!blog) {
        setAndThrowError({ message: HTTP_MESSAGE.NOT_FOUND, status: HTTP_STATUS_CODE.NOT_FOUND_404 });
      }
    }

    const supportFilter = new QueryStringFilter(queryString);
    const filter = supportFilter.prepareQueryString(id);
    const result = await postsCollection
      .find(filter.searchId)
      .sort(filter.sort as {})
      .skip(filter.skip)
      .limit(filter.limit)
      .toArray();
    const count = await postsCollection.countDocuments(filter.searchId);

    return supportFilter.prepareDataAnswer(count, result, 'posts');
  }

  async findById(id: string): Promise<PostType> {
    const result = await postsCollection.findOne({ id });
    if (!result) {
      setAndThrowError({ message: HTTP_MESSAGE.NOT_FOUND, status: HTTP_STATUS_CODE.NOT_FOUND_404 });
    }

    return new PostsViewDto(result!);
  }
}

export const postsQueryRepository = new PostsQueryRepository();