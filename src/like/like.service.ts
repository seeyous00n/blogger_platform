import { CommentViewType, CommentWithLikeViewType, InputLikeStatusType } from "../comments/types/comment.types";
import { LikeRepository } from "./like.repository";
import { PostViewForMapType, PostViewType } from "../posts/types/post.types";
import { LikeStatusType } from "../common/db/schemes/likesSchema";
import { LikeCreateDto } from "./dto/likeCreate.dto";
import { LikesTypeWithId, ResultLikeType } from "./types/like.types";
import { UserRepository } from "../users/users.repository";

export const LIKE = 'Like';
const DISLIKE = 'Dislike';
const DEFAULT_MY_STATUS = 'None';

export class LikeService {
  constructor(
    private likeRepository: LikeRepository,
    private userRepository: UserRepository) {
  }

  async createLike(data: InputLikeStatusType) {
    const like = await this.likeRepository.findLikeByParentIdAndAuthorId(data.parentId, data.authorId);
    if (!like) {
      const newLike = new LikeCreateDto(data);
      await this.likeRepository.createLike(newLike);

      return;
    }

    if (data.likeStatus !== like.status) {
      like.status = data.likeStatus;

      await like.save();
    }
  }

  private async getLikesCount(id: string): Promise<ResultLikeType> {
    const likesCount = await this.likeRepository.getCount(id, LIKE);
    const dislikesCount = await this.likeRepository.getCount(id, DISLIKE);

    return { likesCount, dislikesCount };
  }

  private async getMyStatus(parentId: string, authorId: string): Promise<LikeStatusType> {
    const like = await this.likeRepository.findLikeByParentIdAndAuthorId(parentId, authorId);

    if (like) {
      return like.status;
    }

    return DEFAULT_MY_STATUS;
  }

  async getCommentWithLike(comment: CommentViewType, authorId: string | undefined): Promise<CommentWithLikeViewType> {
    const { likesCount, dislikesCount } = await this.getLikesCount(comment._id.toString());
    let myStatus = DEFAULT_MY_STATUS;

    if (authorId) {
      myStatus = await this.getMyStatus(comment._id.toString(), authorId);
    }

    return { ...comment, likesCount, dislikesCount, myStatus };
  };

  async getCommentsWithLikes(comments: CommentViewType[], authorId: string | undefined): Promise<CommentWithLikeViewType[]> {
    const commentsWithLike = comments.map(async (comment): Promise<CommentWithLikeViewType> => {
      return await this.getCommentWithLike(comment, authorId);
    });

    return await Promise.all(commentsWithLike);
  };

  async getPostWithLike(post: PostViewType, authorId: string | undefined): Promise<PostViewForMapType> {
    const { likesCount, dislikesCount } = await this.getLikesCount(post._id.toString());
    let myStatus = DEFAULT_MY_STATUS;

    if (authorId) {
      myStatus = await this.getMyStatus(post._id.toString(), authorId);
    }

    const likesOfPosts: LikesTypeWithId[] = await this.likeRepository.findLikesWithLimit(post._id.toString());

    const mapLikesOfPosts = likesOfPosts.length ?
      likesOfPosts.map(async (item) => {
        const user = await this.userRepository.findById(item.authorId);

        return { addedAt: item.createdAt.toString(), userId: item.authorId, login: user!.login };
      }) : [];

    const newestLikes = await Promise.all(mapLikesOfPosts);

    return {
      ...post,
      extendedLikesInfo: {
        likesCount, dislikesCount, myStatus,
        newestLikes: [...newestLikes]
      }
    };
  };

  async getPostsWithLikes(posts: PostViewType[], authorId: string | undefined): Promise<PostViewForMapType[]> {
    const commentsWithLike = posts.map(async (post): Promise<PostViewForMapType> => {
      return await this.getPostWithLike(post, authorId);
    });

    return await Promise.all(commentsWithLike);
  };
}