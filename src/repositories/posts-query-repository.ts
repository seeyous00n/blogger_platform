import { postsCollection } from '../db';
import { PostsViewDto } from '../dtos/posts-view-dto';
import { NotFoundError } from '../utils/error-handler';
import { ERROR_MESSAGE, queryStringType } from '../types/types';
import { ObjectId } from 'mongodb';
import { BaseQueryHelper } from '../filters/base-query-helper';

class PostsQueryRepository {
  async findPosts(queryString: queryStringType, id?: string) {
    const _id = id ? new ObjectId(id) : undefined;
    const searchString = _id ? { blogId: _id } : queryString.searchNameTerm ? { name: { $regex: queryString.searchNameTerm, $options: 'i', }, } : {};
    const queryHelper = new BaseQueryHelper(queryString, searchString);

    const result = await postsCollection
      .find(queryHelper.filter.search)
      .sort(queryHelper.filter.sort)
      .skip(queryHelper.filter.skip)
      .limit(queryHelper.filter.limit)
      .toArray();

    const postsCount = await postsCollection.countDocuments(queryHelper.filter.search);
    const posts = result.map((item) => new PostsViewDto(item));

    return {
      'pagesCount': Math.ceil(postsCount / Number(queryHelper.pageSize)),
      'page': Number(queryHelper.pageNumber),
      'pageSize': Number(queryHelper.pageSize),
      'totalCount': postsCount,
      'items': posts,
    };
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