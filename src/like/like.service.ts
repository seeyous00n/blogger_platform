import { LikesType } from "../common/db/schemes/likesSchema";
import { LikeWithMyStatusType } from "./types/like.types";
import { CommentWithLikeViewDto } from "../comments/dto/commentView.dto";
import { CommentViewType } from "../comments/types/comment.types";

const LIKE = 'Like';
const DISLIKE = 'Dislike';
const DEFAULT_MY_STATUS = 'None';

export class LikeService {
  countLikeComments(likes: LikesType[], authorId: string | undefined): LikeWithMyStatusType {
    return likes.reduce<LikeWithMyStatusType>((accum: LikeWithMyStatusType, currentValue: LikesType): LikeWithMyStatusType => {
      if (currentValue.status === LIKE) {
        accum.likesCount += 1;
      }
      if (currentValue.status === DISLIKE) {
        accum.dislikesCount += 1;
      }
      if (currentValue.authorId === authorId) {
        accum.myStatus = currentValue.status;
      }

      return accum;
    }, { likesCount: 0, dislikesCount: 0, myStatus: DEFAULT_MY_STATUS });
  };

  //TODO rename..
  countLikeForAllComments(comments: CommentViewType[], likes: LikesType[], authorId: string | undefined): CommentWithLikeViewDto[] {
    return comments.map((comment) => {
      const likesInfo = likes.reduce<LikeWithMyStatusType>((accum: LikeWithMyStatusType, currentValue: LikesType): LikeWithMyStatusType => {
        if (comment._id.toString() === currentValue.parentId) {
          if (currentValue.status === LIKE) {
            accum.likesCount += 1;
          }
          if (currentValue.status === DISLIKE) {
            accum.dislikesCount += 1;
          }
          if (currentValue.authorId === authorId) {
            accum.myStatus = currentValue.status;
          }
        }

        return accum;
      }, { likesCount: 0, dislikesCount: 0, myStatus: DEFAULT_MY_STATUS });

      return new CommentWithLikeViewDto(comment, likesInfo);
    });
  };
}