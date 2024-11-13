import { postsRepository } from '../posts/posts.repository';
import { CustomError, TYPE_ERROR } from '../common/errorHandler';
import { commentRepository } from './comment.repository';
import { CommentUpdateModel } from './models/CommentUpdate.model';
import { CommentCreateInputModel } from './models/CommentCreateInput.model';
import { CommentEntityType } from './types/comment.types';
import { InsertOneResult } from 'mongodb';

class CommentService {
  async createComment(data: CommentCreateInputModel): Promise<InsertOneResult<CommentEntityType>> {
    const post = await postsRepository.findById(data.postId);
    if (!post) {
      throw new CustomError(TYPE_ERROR.NOT_FOUND);
    }

    const newComment: CommentEntityType = {
      postId: data.postId,
      content: data.comment,
      commentatorInfo: {
        userId: data.userId,
        userLogin: 'string',
      },
      createdAt: new Date().toISOString(),
    };

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