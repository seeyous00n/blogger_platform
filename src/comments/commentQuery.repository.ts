import { queryStringType } from '../common/types/types';
import { ObjectId } from 'mongodb';
import { BaseQueryFieldsUtil } from '../common/utils/baseQueryFields.util';
import { CommentViewDto } from './dto/commentView.dto';
import { isObjectId } from '../common/adapters/mongodb.service';
import { CommentsViewModel } from './models/CommentsView.model';
import { CommentModel } from "../common/db/schemes/commentSchema";
import { CommentViewType } from "./types/comment.types";
import { LikeHelper } from "../like/like.helper";
import { inject, injectable } from "inversify";

@injectable()
export class CommentQueryRepository {
  constructor(@inject(LikeHelper) private likeHelper: LikeHelper) {
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

    return {
      'pagesCount': Math.ceil(commentsCount / queryHelper.pageSize),
      'page': queryHelper.pageNumber,
      'pageSize': queryHelper.pageSize,
      'totalCount': commentsCount,
      'items': commentsWithLikes,
    };
  }

  async findCommentById(id: string, authorId?: string): Promise<CommentViewDto | null> {
    isObjectId(id);
    const comment = await CommentModel.findOne({ _id: new ObjectId(id) }).lean();
    if (!comment) {
      return null;
    }

    const commentWithLike = await this.likeHelper.getCommentWithLike(comment, authorId);

    return new CommentViewDto(commentWithLike);
  }
}