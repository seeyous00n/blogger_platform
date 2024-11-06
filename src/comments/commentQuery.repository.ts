import { commentsCollection } from '../db';
import { CustomError, TYPE_ERROR } from '../common/errorHandler';
import { ERROR_MESSAGE, queryStringType } from '../common/types/types';
import { ObjectId } from 'mongodb';
import { BaseQueryFieldsUtil } from '../common/utils/baseQueryFields.util';
import { CommentViewDto } from './dto/commentView.dto';
import { isObjectId } from '../common/adapters/mongodb.service';
import { CommentsViewModel } from './models/CommentsView.model';

class CommentQueryRepository {
  async findComments(queryString: queryStringType, id?: string): Promise<CommentsViewModel> {
    const searchString = { postId: id };

    const queryHelper = new BaseQueryFieldsUtil(queryString, searchString);

    const result = await commentsCollection
      .find(queryHelper.filter.search)
      .sort(queryHelper.filter.sort)
      .skip(queryHelper.filter.skip)
      .limit(queryHelper.filter.limit)
      .toArray();

    const commentsCount = await commentsCollection.countDocuments(queryHelper.filter.search);
    const comments = result.map((item) => new CommentViewDto(item));

    return {
      'pagesCount': Math.ceil(commentsCount / queryHelper.pageSize),
      'page': queryHelper.pageNumber,
      'pageSize': queryHelper.pageSize,
      'totalCount': commentsCount,
      'items': comments,
    };
  }

  async findCommentById(id: string): Promise<CommentViewDto> {
    isObjectId(id);
    const result = await commentsCollection.findOne({ _id: new ObjectId(id) });
    if (!result) {
      throw new CustomError(TYPE_ERROR.NOT_FOUND, ERROR_MESSAGE.NOT_FOUND);
    }

    return new CommentViewDto(result);
  }
}

export const commentQueryRepository = new CommentQueryRepository();