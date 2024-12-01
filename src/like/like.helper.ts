import { CommentViewType, CommentWithLikeViewType, InputLikeStatusType } from "../comments/types/comment.types";
import { PostViewForMapType, PostViewType } from "../posts/types/post.types";
import { LikesModel } from "../common/db/schemes/likesSchema";
import { LikeCreateDto } from "./dto/likeCreate.dto";
import {
  LikesObjectStructType,
  LikesObjectWithNewestStructType,
  LikesWithIdType,
  LikeWithMyStatusType,
  LikeWithNewestType
} from "./types/like.types";
import { PostsViewDto } from "../posts/dto/postsView.dto";
import { CommentViewDto } from "../comments/dto/commentView.dto";

const LIKE = 'Like';
const DISLIKE = 'Dislike';
const DEFAULT_MY_STATUS = 'None';
const MAX_LIMIT = 3;

export class LikeHelper {
  private getLikesInfoWithoutNewest(index: string, likes: LikesWithIdType[], authorId: string | undefined): LikeWithMyStatusType {
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
    const likesInfo = this.getLikesInfoWithoutNewest(comment._id.toString(), likes, authorId);

    return { ...comment, ...likesInfo };
  };


  private getLikesInfoWithoutNewestMany(likes: LikesWithIdType[], authorId: string | undefined): LikesObjectStructType {
    return likes.reduce<LikesObjectStructType>((accum: LikesObjectStructType, currentValue): LikesObjectStructType => {
      if (`${currentValue.parentId}` in accum) {

        if (currentValue.status === LIKE) {
          accum[`${currentValue.parentId}`].likesCount += 1;
        }

        if (currentValue.status === DISLIKE) {
          accum[`${currentValue.parentId}`].dislikesCount += 1;
        }

        if (currentValue.authorId === authorId) {
          accum[`${currentValue.parentId}`].myStatus = currentValue.status;
        }

        return accum;
      }

      accum[`${currentValue.parentId}`] = {
        likesCount: currentValue.status === LIKE ? 1 : 0,
        dislikesCount: currentValue.status === DISLIKE ? 1 : 0,
        myStatus: currentValue.authorId === authorId ? currentValue.status : DEFAULT_MY_STATUS
      };

      return accum;
    }, {} as LikesObjectStructType);
  }

  async getCommentsWithLikes(comments: CommentViewType[], authorId: string | undefined): Promise<CommentViewDto[]> {
    const commentIdArray = comments.map((comment) => comment._id.toString());
    const likes = await LikesModel.find({ parentId: commentIdArray }).lean();
    const likesStructComments = this.getLikesInfoWithoutNewestMany(likes, authorId);

    return comments.map((comment) => {
      const likeInfo = likesStructComments[`${comment._id}`] ? likesStructComments[`${comment._id}`] : {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: DEFAULT_MY_STATUS,
        newestLikes: []
      };

      const data = { ...comment, ...likeInfo };

      return new CommentViewDto(data);
    });
  };

  private getLikesInfoWithNewest(index: string, likes: LikesWithIdType[], authorId: string | undefined): LikeWithNewestType {
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
    const likesInfoWithNewest = this.getLikesInfoWithNewest(post._id.toString(), likes, authorId);

    return {
      ...post,
      extendedLikesInfo: { ...likesInfoWithNewest }
    };
  };

  private getLikesInfoWithNewestMany(likes: LikesWithIdType[], authorId: string | undefined): LikesObjectWithNewestStructType {
    //TODO для создания объектов такой структуры нужно использовать Map!!
    return likes.reduce<LikesObjectWithNewestStructType>((accum: LikesObjectWithNewestStructType, currentValue): LikesObjectWithNewestStructType => {
      if (`${currentValue.parentId}` in accum) {

        if (currentValue.status === LIKE) {
          accum[`${currentValue.parentId}`].likesCount += 1;

          if (accum[`${currentValue.parentId}`].newestLikes.length < MAX_LIMIT && currentValue.isNewLike === 1) {
            const newest = {
              addedAt: currentValue.createdAt,
              userId: currentValue.authorId,
              login: currentValue.authorLogin
            };

            accum[`${currentValue.parentId}`].newestLikes.push(newest);
          }
        }

        if (currentValue.status === DISLIKE) {
          accum[`${currentValue.parentId}`].dislikesCount += 1;
        }

        if (currentValue.authorId === authorId) {
          accum[`${currentValue.parentId}`].myStatus = currentValue.status;
        }

        return accum;
      }

      accum[`${currentValue.parentId}`] = {
        likesCount: currentValue.status === LIKE ? 1 : 0,
        dislikesCount: currentValue.status === DISLIKE ? 1 : 0,
        myStatus: currentValue.authorId === authorId ? currentValue.status : DEFAULT_MY_STATUS,
        newestLikes: []
      };

      const newest = currentValue.status === LIKE && currentValue.isNewLike === 1 ? {
        addedAt: currentValue.createdAt,
        userId: currentValue.authorId,
        login: currentValue.authorLogin
      } : null;

      if (newest) {
        accum[`${currentValue.parentId}`].newestLikes.push(newest);
      }

      return accum;
    }, {} as LikesObjectWithNewestStructType);
  }

  async getPostsWithLikes(posts: PostViewType[], authorId: string | undefined): Promise<PostsViewDto[]> {
    const postIdArray = posts.map((post) => post._id.toString());
    const likes = await LikesModel.find({ parentId: postIdArray }).sort({ createdAt: -1 }).lean();
    const likesStructPost = this.getLikesInfoWithNewestMany(likes, authorId);

    return posts.map((post) => {
      const likeInfoWithNewest = likesStructPost[`${post._id}`] ? likesStructPost[`${post._id}`] : {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: DEFAULT_MY_STATUS,
        newestLikes: []
      };

      const data = {
        ...post, extendedLikesInfo: { ...likeInfoWithNewest }
      };

      return new PostsViewDto(data);
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