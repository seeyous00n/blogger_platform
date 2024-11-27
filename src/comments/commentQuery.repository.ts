import { queryStringType } from '../common/types/types';
import { ObjectId } from 'mongodb';
import { BaseQueryFieldsUtil } from '../common/utils/baseQueryFields.util';
import { CommentWithLikeViewDto } from './dto/commentView.dto';
import { isObjectId } from '../common/adapters/mongodb.service';
import { CommentsViewModel } from './models/CommentsView.model';
import { CommentModel } from "../common/db/schemes/commentSchema";
import { LikesModel, LikesType } from "../common/db/schemes/likesSchema";
import { countLikeComments, countLikeForAllComments } from "../like/like.service";
import { CommentViewType } from "./types/comment.types";

export class CommentQueryRepository {
  async findComments(queryString: queryStringType, id: string, authorId: string | undefined): Promise<CommentsViewModel> {
    const searchString = { postId: id };

    const queryHelper = new BaseQueryFieldsUtil(queryString, searchString);

    const comments: CommentViewType[] = await CommentModel
      .find(queryHelper.filter.search)
      .sort(queryHelper.filter.sort)
      .skip(queryHelper.filter.skip)
      .limit(queryHelper.filter.limit)
      .lean();

    const commentsId = comments.map((comment) => comment._id.toString());

    const likes: LikesType[] = await LikesModel.find({ parentId: commentsId }).lean();
    const result = countLikeForAllComments(comments, likes, authorId);

    const commentsCount = await CommentModel.countDocuments(queryHelper.filter.search);

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

    const likes: LikesType[] = await LikesModel.find({ parentId: comment._id.toString() }).lean();
    const likesInfo = countLikeComments(likes, authorId);

    return new CommentWithLikeViewDto(comment, likesInfo);
  }
}