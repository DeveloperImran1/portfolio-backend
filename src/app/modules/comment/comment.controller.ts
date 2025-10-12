/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { CommentServices } from './comment.services';

const createComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const paylaod = { ...req.body, userId: decodedToken?.userId };

    const comment = await CommentServices.createComment(paylaod);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Successfully Comment Done',
      data: { comment },
    });
  },
);

const allCommentWithBlogId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const blogId = req.params.blogId;
    const comment = await CommentServices.allCommentWithBlogId(blogId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Comment retrived successfully',
      data: comment,
    });
  },
);

const updatedComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.id;

    const payload = { ...req.body };
    const updatedComment = await CommentServices.updateComment(
      commentId,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Comment updated successfully',
      data: updatedComment,
    });
  },
);

const deleteComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params.id;

    await CommentServices.deleteComment(commentId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Comment deleted',
      data: null,
    });
  },
);

export const CommentController = {
  createComment,
  allCommentWithBlogId,
  updatedComment,
  deleteComment,
};
