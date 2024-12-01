import { queryStringType } from '../common/types/types';
import { ObjectId } from 'mongodb';
import { BaseQueryFieldsUtil } from '../common/utils/baseQueryFields.util';
import { CommentWithLikeViewDto } from './dto/commentView.dto';
import { isObjectId } from '../common/adapters/mongodb.service';
import { CommentsViewModel } from './models/CommentsView.model';
import { CommentModel } from "../common/db/schemes/commentSchema";
import { CommentViewType } from "./types/comment.types";
import { LikeHelper } from "../like/like.helper";

export class CommentQueryRepository {
  constructor(private likeHelper: LikeHelper) {
  }

  async findComments(queryString: queryStringType, id: string, authorId: string | undefined): Promise<CommentsViewModel> {
    const searchString = { postId: id };

    const queryHelper = new BaseQueryFieldsUtil(queryString, searchString);

    const comments: CommentViewType[] = await CommentModel
      .find(queryHelper.filter.search)
      .sort(queryHelper.filter.sort)
      .skip(queryHelper.filter.skip)
      .limit(queryHelper.filter.limit)
      .lean();

    const commentsCount = await CommentModel.countDocuments(queryHelper.filter.search);

    const commentsWithLikes = await this.likeHelper.getCommentsWithLikes(comments, authorId);

    const result = commentsWithLikes.map((item) => new CommentWithLikeViewDto(item));

    return {
      'pagesCount': Math.ceil(commentsCount / queryHelper.pageSize),
      'page': queryHelper.pageNumber,
      'pageSize': queryHelper.pageSize,
      'totalCount': commentsCount,
      'items': result,
    };
  }

  async findCommentById(id: string, authorId?: string): Promise<CommentWithLikeViewDto | null> {
    isObjectId(id);
    const comment = await CommentModel.findOne({ _id: new ObjectId(id) }).lean();
    if (!comment) {
      return null;
    }

    const commentWithLike = await this.likeHelper.getCommentWithLike(comment, authorId);

    return new CommentWithLikeViewDto(commentWithLike);
  }
}