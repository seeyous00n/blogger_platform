import { postsCollection } from '../db';
import { PostsViewDto } from '../dtos/posts-view-dto';
import { NotFoundError } from '../utils/error-handler';
import { TYPE_COLLECTION } from '../settings';
import { ERROR_MESSAGE, queryStringType } from '../types/types';
import { ObjectId } from 'mongodb';
import { QueryHelper } from '../filters/query-helper';
import { dataMapper, prepareDataAnswer } from '../utils/map-data';

class PostsQueryRepository {
  async findPosts(queryString: queryStringType, id?: string) {
    const _id = id ? new ObjectId(id) : undefined;
    const queryHelper = new QueryHelper(queryString);
    const filter = queryHelper.parsFilter(_id);
    const result = await postsCollection
      .find(filter.search)
      .sort(filter.sort)
      .skip(filter.skip)
      .limit(filter.limit)
      .toArray();

    const postsCount = await postsCollection.countDocuments(filter.search);
    const posts = dataMapper(result, TYPE_COLLECTION.POSTS);

    return prepareDataAnswer(posts, postsCount, queryHelper)
  }

  async findById(id: string) {
    const result = await postsCollection.findOne({ _id: new ObjectId(id) });
    if (!result) {
      throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND);
    }

    return new PostsViewDto(result);
  }
}

export const postsQueryRepository = new PostsQueryRepository();