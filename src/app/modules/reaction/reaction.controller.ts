/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { ReactionServices } from './reaction.services';

const createReaction = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const paylaod = { ...req.body, userId: decodedToken?.userId };

    const reaction = await ReactionServices.createReaction(
      paylaod,
      decodedToken,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Done',
      data: { reaction },
    });
  },
);

const allReactionWithBlogId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const blogId = req.params.blogId;
    const reaction = await ReactionServices.allReactionWithBlogId(blogId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Blog Reaction retrived successfully',
      data: reaction,
    });
  },
);

export const ReactionController = { createReaction, allReactionWithBlogId };
