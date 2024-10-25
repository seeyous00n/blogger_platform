import { postsCollection } from '../db';
import { PostsViewDto } from '../dtos/posts-view-dto';
import { NotFoundError } from '../utils';
import {  TYPE_COLLECTION } from '../settings';
import { QueryStringFilter } from '../filters/query-string-filter';
import { ERROR_MESSAGE, queryStringType } from '../types/types';
import { blogsQueryRepository } from './blogs-query-repository';
import { ObjectId } from 'mongodb';
import { sharedRepository } from './shared-repository';

class PostsQueryRepository {
  async findPosts(queryString: queryStringType, id?: string) {
    let _id = undefined;
    if (id) {
      const result =  await blogsQueryRepository.findById(id);
      _id = new ObjectId(result.id)
    }

    const supportFilter = new QueryStringFilter(queryString);
    const filter = supportFilter.prepareQueryString(_id);
    const result = await sharedRepository.findData(postsCollection, filter);
    const postsCount = await postsCollection.countDocuments(filter.search);

    return supportFilter.prepareDataAnswer(postsCount, result, TYPE_COLLECTION.POSTS);
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