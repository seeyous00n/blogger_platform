import { commentsCollection } from '../db';
import { NotFoundError } from '../utils/error-handler';
import { ERROR_MESSAGE, queryStringType } from '../types/types';
import { ObjectId } from 'mongodb';
import { BaseQueryHelper } from '../filters/base-query-helper';
import { CommentViewDto } from '../dtos/comment-view-dto';
import { BaseRepository } from './base-repository';

class CommentQueryRepository extends BaseRepository {
  async findComments(queryString: queryStringType, id?: string) {
    const searchString = { postId: id };

    const queryHelper = new BaseQueryHelper(queryString, searchString);

    const result = await commentsCollection
      .find(queryHelper.filter.search)
      .sort(queryHelper.filter.sort)
      .skip(queryHelper.filter.skip)
      .limit(queryHelper.filter.limit)
      .toArray();

    const commentsCount = await commentsCollection.countDocuments(queryHelper.filter.search);
    const comments = result.map((item) => new CommentViewDto(item));

    return {
      'pagesCount': Math.ceil(commentsCount / Number(queryHelper.pageSize)),
      'page': Number(queryHelper.pageNumber),
      'pageSize': Number(queryHelper.pageSize),
      'totalCount': commentsCount,
      'items': comments,
    };
  }

  async findCommentById(id: string) {
    await this.isObjectId(id);
    const result = await commentsCollection.findOne({ _id: new ObjectId(id) });
    if (!result) {
      throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND);
    }

    return new CommentViewDto(result);
  }
}

export const commentQueryRepository = new CommentQueryRepository();