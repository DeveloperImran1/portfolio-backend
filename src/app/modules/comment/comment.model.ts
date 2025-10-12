// comment.model.ts
import { Schema, model } from 'mongoose';
import { IComment } from './comment.interface';

const commentSchema = new Schema<IComment>(
  {
    blogId: {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
    versionKey: false,
  },
);

// Optional: compound index to query top-level comments faster
commentSchema.index({ blogId: 1, parentId: 1, createdAt: -1 });

export const Comment = model<IComment>('Comment', commentSchema);
