import { PostType } from '../types/post-types';
import { postsCollection } from '../db';
import { PostsViewDto } from '../dtos/posts-view-dto';
import { setAndThrowError } from '../utils';
import { HTTP_MESSAGE, HTTP_STATUS_CODE, TYPE_COLLECTION } from '../settings';
import { QueryStringFilter } from '../filters/query-string-filter';
import { queryStringType } from '../types/types';
import { blogsQueryRepository } from './blogs-query-repository';
import { ObjectId } from 'mongodb';
import { QueryViewModel } from '../models/ViewQueryModel';
import { sharedRepository } from './shared-repository';

class PostsQueryRepository {
  async findPosts(queryString: queryStringType, _id?: string): Promise<QueryViewModel> {
    if (_id) {
      const blog = await blogsQueryRepository.findById(_id);
      if (!blog) {
        setAndThrowError({ message: HTTP_MESSAGE.NOT_FOUND, status: HTTP_STATUS_CODE.NOT_FOUND_404 });
      }
    }

    const id = _id ? new ObjectId(_id) : undefined;
    const supportFilter = new QueryStringFilter(queryString);
    const filter = supportFilter.prepareQueryString(id);
    const result = await sharedRepository.findData(postsCollection, filter);
    const postsCount = await postsCollection.countDocuments(filter.search);

    return supportFilter.prepareDataAnswer(postsCount, result, TYPE_COLLECTION.POSTS);
  }

  async findById(_id: string): Promise<PostType> {
    const id = new ObjectId(_id);
    const result = await postsCollection.findOne({ id });
    if (!result) {
      setAndThrowError({ message: HTTP_MESSAGE.NOT_FOUND, status: HTTP_STATUS_CODE.NOT_FOUND_404 });
    }

    return new PostsViewDto(result!);
  }
}

export const postsQueryRepository = new PostsQueryRepository();