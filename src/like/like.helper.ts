import { CommentViewType, CommentWithLikeViewType, InputLikeStatusType } from "../comments/types/comment.types";
import { PostViewForMapType, PostViewType } from "../posts/types/post.types";
import { LikesModel } from "../common/db/schemes/likesSchema";
import { LikeCreateDto } from "./dto/likeCreate.dto";
import { LikesWithIdType, LikeWithMyStatusType, LikeWithNewestType } from "./types/like.types";

const LIKE = 'Like';
const DISLIKE = 'Dislike';
const DEFAULT_MY_STATUS = 'None';
const MAX_LIMIT = 3;

export class LikeHelper {
  private getLikeInfo(index: string, likes: LikesWithIdType[], authorId: string | undefined): LikeWithMyStatusType {
    return likes.reduce<LikeWithMyStatusType>((accum: LikeWithMyStatusType, currentValue: LikesWithIdType): LikeWithMyStatusType => {
      if (index === currentValue.parentId) {
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
  }

  async getCommentWithLike(comment: CommentViewType, authorId: string | undefined): Promise<CommentWithLikeViewType> {
    const likes = await LikesModel.find({ parentId: comment._id.toString() }).lean();
    const likeInfo = this.getLikeInfo(comment._id.toString(), likes, authorId);

    return { ...comment, ...likeInfo };
  };

  async getCommentsWithLikes(comments: CommentViewType[], authorId: string | undefined): Promise<CommentWithLikeViewType[]> {
    const commentIdArray = comments.map((comment) => comment._id.toString());
    const likes = await LikesModel.find({ parentId: commentIdArray }).lean();

    return comments.map((comment) => {
      const likeInfo = this.getLikeInfo(comment._id.toString(), likes, authorId);

      return { ...comment, ...likeInfo };
    });
  };

  private getLikeInfoWithNewest(index: string, likes: LikesWithIdType[], authorId: string | undefined): LikeWithNewestType {
    return likes.reduce<LikeWithNewestType>((accum: LikeWithNewestType, currentValue: LikesWithIdType): LikeWithNewestType => {
      if (index === currentValue.parentId) {
        if (currentValue.status === LIKE) {
          accum.likesCount += 1;
        }
        if (currentValue.status === DISLIKE) {
          accum.dislikesCount += 1;
        }
        if (currentValue.authorId === authorId) {
          accum.myStatus = currentValue.status;
        }

        if (currentValue.isNewLike === 1 && currentValue.status === LIKE && accum.newestLikes.length < MAX_LIMIT) {
          accum.newestLikes.push({
            addedAt: currentValue.createdAt,
            userId: currentValue.authorId,
            login: currentValue.authorLogin
          });
        }
      }

      return accum;
    }, {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: DEFAULT_MY_STATUS,
      newestLikes: []
    });
  }

  async getPostWithLike(post: PostViewType, authorId: string | undefined): Promise<PostViewForMapType> {
    const likes = await LikesModel.find({ parentId: post._id.toString() }).sort({ createdAt: -1 }).lean();
    const likeInfoWithNewest = this.getLikeInfoWithNewest(post._id.toString(), likes, authorId);

    return {
      ...post,
      extendedLikesInfo: {
        likesCount: likeInfoWithNewest.likesCount,
        dislikesCount: likeInfoWithNewest.dislikesCount,
        myStatus: likeInfoWithNewest.myStatus,
        newestLikes: likeInfoWithNewest.newestLikes
      }
    };
  };

  async getPostsWithLikes(posts: PostViewType[], authorId: string | undefined): Promise<PostViewForMapType[]> {
    const postIdArray = posts.map((post) => post._id.toString());
    const likes = await LikesModel.find({ parentId: postIdArray }).sort({ createdAt: -1 }).lean();

    return posts.map((post) => {
      // const likes = await LikesModel.find({ parentId: post._id.toString() }).sort({ createdAt: -1 }).lean();
      const likeInfoWithNewest = this.getLikeInfoWithNewest(post._id.toString(), likes, authorId);

      return {
        ...post,
        extendedLikesInfo: {
          likesCount: likeInfoWithNewest.likesCount,
          dislikesCount: likeInfoWithNewest.dislikesCount,
          myStatus: likeInfoWithNewest.myStatus,
          newestLikes: likeInfoWithNewest.newestLikes
        }
      };
    });
  };

  async createLike(data: InputLikeStatusType & { authorLogin: string }) {
    const like = await LikesModel.findOne({ parentId: data.parentId, authorId: data.authorId });

    if (!like) {
      const newLike = new LikeCreateDto(data);
      await LikesModel.create(newLike);

      return;
    }

    if (data.likeStatus !== like.status) {
      like.status = data.likeStatus;

      await like.save();
    }
  }
}