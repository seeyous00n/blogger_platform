import { LikesType } from "../common/db/schemes/likesSchema";
import { LikeWithMyStatusType } from "./types/like.types";
import { tokenService } from "../composition-root";
import { RequestWithQuery } from "../common/types/types";
import { CommentWithLikeViewDto } from "../comments/dto/commentView.dto";
import { CommentViewType } from "../comments/types/comment.types";

const LIKE = 'Like';
const DISLIKE = 'Dislike';
const DEFAULT_MY_STATUS = 'None';

export const countLikeComments = (likes: LikesType[], authorId: string | undefined): LikeWithMyStatusType => {
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

export const countLikeForAllComments = (comments: CommentViewType[], likes: LikesType[], authorId: string | undefined): CommentWithLikeViewDto[] => {
  const result = [] as CommentWithLikeViewDto[];

  comments.forEach((comment) => {
    let likeCount = 0;
    let dislikeCount = 0;
    let myStatus = DEFAULT_MY_STATUS;

    likes.forEach((like) => {
      if (comment._id.toString() === like.parentId) {
        if (like.status === LIKE) {
          likeCount += 1;
        }

        if (like.status === DISLIKE) {
          dislikeCount += 1;
        }

        if (like.authorId === authorId) {
          myStatus = like.status;
        }
      }
    });

    const likesInfo = { likesCount: likeCount, dislikesCount: dislikeCount, myStatus: myStatus };

    const readyAnswer = new CommentWithLikeViewDto(comment, likesInfo);
    result.push(readyAnswer);

    likeCount = 0;
    dislikeCount = 0;
    myStatus = DEFAULT_MY_STATUS;
  });

  return result;
};

export const isLoginUser = (req: RequestWithQuery<{}, {}>): string | undefined => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return;
  }

  const [_, token] = authHeader.split(' ');

  const payload = tokenService.validateAccessToken(token);
  if (!payload) {
    return;
  }

  return payload.userId;
};