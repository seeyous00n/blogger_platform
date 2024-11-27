import { PostsRepository } from '../posts/posts.repository';
import { CustomError, TYPE_ERROR } from '../common/errorHandler';
import { CommentUpdateModel } from './models/CommentUpdate.model';
import { CommentCreateInputModel } from './models/CommentCreateInput.model';
import { CommentCreateDto } from "./dto/commentCreate.dto";
import { CommentDocument } from "../common/db/schemes/commentSchema";
import { CommentRepository } from "./comment.repository";
import { UserRepository } from "../users/users.repository";
import { LikeRepository } from "../like/like.repository";
import { InputLikeStatusType } from "./types/comment.types";
import { LikeCreateDto } from "../like/dto/likeCreate.dto";

export class CommentService {
  constructor(
    private commentRepository: CommentRepository,
    private userRepository: UserRepository,
    private postsRepository: PostsRepository,
    private likeRepository: LikeRepository) {
  }

  async createComment(data: CommentCreateInputModel): Promise<CommentDocument> {
    const post = await this.postsRepository.findById(data.postId);
    if (!post) {
      throw new CustomError(TYPE_ERROR.NOT_FOUND);
    }

    const user = await this.userRepository.findById(data.userId);
    if (!user) {
      throw new CustomError(TYPE_ERROR.NOT_FOUND);
    }

    const newComment = new CommentCreateDto({ ...data, userLogin: user.login });

    return await this.commentRepository.createByData(newComment);
  }

  async updateCommentById(id: string, data: CommentUpdateModel, userId: string): Promise<void> {
    await this.checkOwnerComment(id, userId);
    await this.commentRepository.updateById(id, data);
  }

  async deleteCommentById(id: string, userId: string): Promise<void> {
    await this.checkOwnerComment(id, userId);
    await this.commentRepository.deleteById(id);
  }

  async checkOwnerComment(commentId: string, userId: string): Promise<void> {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new CustomError(TYPE_ERROR.NOT_FOUND);
    }

    const result = await this.commentRepository.findByIdAndUserId(commentId, userId);
    if (!result) {
      throw new CustomError(TYPE_ERROR.FORBIDDEN_ERROR);
    }
  }

  async updateLike(data: InputLikeStatusType): Promise<void> {
    const comment = await this.commentRepository.findById(data.parentId);
    if (!comment) {
      throw new CustomError(TYPE_ERROR.NOT_FOUND);
    }

    const like = await this.likeRepository.getLikeByParentIdAuthorId(data.parentId, data.authorId);
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
}