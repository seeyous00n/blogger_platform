import { LikesType } from "../common/db/schemes/likesSchema";
import { LikeWithMyStatusType } from "./types/like.types";
import { tokenService } from "../composition-root";
import { BEARER } from "../common/middlewares/guards/authJwt.guard";
import { RequestWithQuery } from "../common/types/types";
import { CommentWithLikeViewDto } from "../comments/dto/commentView.dto";
import { CommentViewType } from "../comments/types/comment.types";


export const countLikeComments = (likes: LikesType[], authorId: string | undefined): LikeWithMyStatusType => {
  return likes.reduce<LikeWithMyStatusType>((accum: LikeWithMyStatusType, currentValue: LikesType): LikeWithMyStatusType => {
    if (currentValue.status === 'Like') {
      accum.likesCount += 1;
    }

    if (currentValue.status === 'Dislike') {
      accum.dislikesCount += 1;
    }

    if (currentValue.authorId === authorId) {
      accum.myStatus = currentValue.status;
    }

    return accum;
  }, { likesCount: 0, dislikesCount: 0, myStatus: "None" });
};

export const countLikeForAllComments = (comments: CommentViewType[], likes: LikesType[], authorId: string | undefined): CommentWithLikeViewDto[] => {
  const result = [] as CommentWithLikeViewDto[];

  comments.forEach((comment) => {
    let likeCount = 0;
    let dislikeCount = 0;
    let myStatus = 'None';

    likes.forEach((like) => {
      if (comment._id.toString() === like.parentId) {
        if (like.status === 'Like') {
          likeCount += 1;
        }

        if (like.status === 'Dislike') {
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
    myStatus = 'None';
  });

  return result;
};

export const isLoginUser = async (req: RequestWithQuery<{}, {}>): Promise<string> => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return '';
  }

  const [type, token] = authHeader.split(' ');
  if (type !== BEARER) {
    return '';
  }

  const payload = tokenService.validateAccessToken(token);
  if (!payload) {
    return '';
  }

  return payload.userId;
};