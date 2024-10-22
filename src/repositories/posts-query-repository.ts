import { PostsWithQuery, PostType } from '../types/post-types';
import { postsCollection } from '../db';
import { PostsViewDto } from '../dtos/posts-view-dto';
import { setAndThrowError } from '../utils';
import { HTTP_MESSAGE, HTTP_STATUS_CODE } from '../settings';
import { QueryStringFilter } from '../filters/query-string-filter';
import { queryStringType } from '../types/types';

class PostsQueryRepository {
  async findPosts(queryString: queryStringType) {
    const supportFilter = new QueryStringFilter(queryString);
    const filter = supportFilter.prepareQueryString();
    const result = await postsCollection
      .find({})
      .sort(filter.sort as {})
      .skip(filter.skip)
      .limit(filter.limit)
      .toArray();
    const count = await postsCollection.countDocuments();

    return supportFilter.prepareData(count, result, 'posts');
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