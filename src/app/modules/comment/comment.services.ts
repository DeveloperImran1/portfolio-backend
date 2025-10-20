import httpStatus from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { Blog } from '../blog/blog.model';
import { IComment } from './comment.interface';
import { Comment } from './comment.model';

const createComment = async (paylaod: IComment) => {
  const isBlogExist = await Blog.findById(paylaod?.blogId);
  if (!isBlogExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This blog not exist');
  }
  const commentCount = Number(isBlogExist?.commentCount) + 1;
  await Blog.findByIdAndUpdate(
    paylaod?.blogId,
    { commentCount },
    {
      new: true,
      runValidators: true,
    },
  );

  const comment = await Comment.create(paylaod);
  return comment;
};

const allCommentWithBlogId = async (blogId: string) => {
  const parentComments = await Comment.find({ blogId, parentId: null });
  const commentsWithReplies = await Promise.all(
    parentComments.map(async (parent) => {
      const replies = await Comment.find({ parentId: parent._id });
      return { ...parent.toObject(), replies };
    }),
  );

  return commentsWithReplies;
};

const updateComment = async (commentId: string, payload: Partial<IComment>) => {
  const isCommentExist = await Comment.findById(commentId);

  if (!isCommentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This parent comment not exist');
  }

  const newUpdateComment = await Comment.findByIdAndUpdate(commentId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdateComment;
};

const deleteComment = async (commentId: string) => {
  const isCommentExist = await Comment.findById(commentId);

  if (!isCommentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This comment not exist');
  }

  const deleteComment = await Comment.findByIdAndDelete(commentId);

  return deleteComment;
};

export const CommentServices = {
  createComment,
  allCommentWithBlogId,
  updateComment,
  deleteComment,
};
