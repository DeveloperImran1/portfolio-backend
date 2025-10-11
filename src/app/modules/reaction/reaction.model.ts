import { Schema, model } from 'mongoose';
import { IReaction } from './reaction.interface';

const reactionSchema = new Schema<IReaction>(
  {
    blogId: {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['like', 'love', 'wow'],
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // only createdAt
    versionKey: false,
  },
);

// 🔥 Optional: prevent duplicate reactions (same user on same blog)
reactionSchema.index({ blogId: 1, userId: 1 }, { unique: true });

export const Reaction = model<IReaction>('Reaction', reactionSchema);
