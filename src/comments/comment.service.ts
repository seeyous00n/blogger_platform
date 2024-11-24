import { postsRepository } from '../posts/posts.repository';
import { CustomError, TYPE_ERROR } from '../common/errorHandler';
import { commentRepository } from './comment.repository';
import { CommentUpdateModel } from './models/CommentUpdate.model';
import { CommentCreateInputModel } from './models/CommentCreateInput.model';
import { userRepository } from "../users/users.repository";
import { CommentCreateDto } from "./dto/commentCreate.dto";
import { HydratedDocument } from "mongoose";
import { CommentEntityType } from "./types/comment.types";

class CommentService {
  async createComment(data: CommentCreateInputModel): Promise<HydratedDocument<CommentEntityType>> {
    const post = await postsRepository.findById(data.postId);
    if (!post) {
      throw new CustomError(TYPE_ERROR.NOT_FOUND);
    }

    const user = await userRepository.findById(data.userId);
    if (!user) {
      throw new CustomError(TYPE_ERROR.NOT_FOUND);
    }

    const newComment = new CommentCreateDto({ ...data, userLogin: user.login });
    return await commentRepository.createByData(newComment);
  }

  async updateCommentById(id: string, data: CommentUpdateModel, userId: string): Promise<void> {
    await this.checkOwnerComment(id, userId);
    await commentRepository.updateById(id, data);
  }

  async deleteCommentById(id: string, userId: string): Promise<void> {
    await this.checkOwnerComment(id, userId);
    await commentRepository.deleteById(id);
  }

  async checkOwnerComment(commentId: string, userId: string): Promise<void> {
    const comment = await commentRepository.findById(commentId);
    if (!comment) {
      throw new CustomError(TYPE_ERROR.NOT_FOUND);
    }

    const result = await commentRepository.findByIdAndUserId(commentId, userId);
    if (!result) {
      throw new CustomError(TYPE_ERROR.FORBIDDEN_ERROR);
    }
  }
}

export const commentService = new CommentService();