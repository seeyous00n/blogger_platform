import { CommentViewType, CommentWithLikeViewType } from "../comments/types/comment.types";
import { LikeRepository } from "./like.repository";

const LIKE = 'Like';
const DISLIKE = 'Dislike';
const DEFAULT_MY_STATUS = 'None';

export class LikeService {
  constructor(private likeRepository: LikeRepository) {
  }

  async getCommentWithLike(comment: CommentViewType, authorId: string | undefined): Promise<CommentWithLikeViewType> {
    const likesCount = await this.likeRepository.getCount(comment._id.toString(), LIKE);
    const dislikesCount = await this.likeRepository.getCount(comment._id.toString(), DISLIKE);
    let myStatus = DEFAULT_MY_STATUS;

    if (authorId) {
      const like = await this.likeRepository.findLikeByParentIdAndAuthorId(comment._id.toString(), authorId);

      if (like) {
        myStatus = like.status;
      }
    }

    return { ...comment, likesCount, dislikesCount, myStatus };
  };

  async getCommentsWithLikes(comments: CommentViewType[], authorId: string | undefined): Promise<CommentWithLikeViewType[]> {
    const commentsWithLike = comments.map(async (comment): Promise<CommentWithLikeViewType> => {
      return await this.getCommentWithLike(comment, authorId);
    });

    return await Promise.all(commentsWithLike);
  };
}