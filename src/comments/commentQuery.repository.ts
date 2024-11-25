import { queryStringType } from '../common/types/types';
import { ObjectId } from 'mongodb';
import { BaseQueryFieldsUtil } from '../common/utils/baseQueryFields.util';
import { CommentViewDto } from './dto/commentView.dto';
import { isObjectId } from '../common/adapters/mongodb.service';
import { CommentsViewModel } from './models/CommentsView.model';
import { CommentModel } from "../common/db/schemes/commentSchema";

class CommentQueryRepository {
  async findComments(queryString: queryStringType, id?: string): Promise<CommentsViewModel> {
    const searchString = { postId: id };

    const queryHelper = new BaseQueryFieldsUtil(queryString, searchString);

    const result = await CommentModel
      .find(queryHelper.filter.search)
      .sort(queryHelper.filter.sort)
      .skip(queryHelper.filter.skip)
      .limit(queryHelper.filter.limit)
      .lean();

    const commentsCount = await CommentModel.countDocuments(queryHelper.filter.search);
    const comments = result.map((item) => new CommentViewDto(item));

    return {
      'pagesCount': Math.ceil(commentsCount / queryHelper.pageSize),
      'page': queryHelper.pageNumber,
      'pageSize': queryHelper.pageSize,
      'totalCount': commentsCount,
      'items': comments,
    };
  }

  async findCommentById(id: string): Promise<CommentViewDto | null> {
    isObjectId(id);
    const result = await CommentModel.findOne({ _id: new ObjectId(id) }).lean();
    if (!result) {
      return null;
    }

    return new CommentViewDto(result);
  }
}

export const commentQueryRepository = new CommentQueryRepository();