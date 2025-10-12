import { IReaction } from './reaction.interface';
import { Reaction } from './reaction.model';

const createReaction = async (paylaod: IReaction) => {
  const reaction = await Reaction.create(paylaod);
  return reaction;
};

const allReactionWithBlogId = async (blogId: string) => {
  const reaction = await Reaction.find({ blogId });
  return reaction;
};

export const ReactionServices = { createReaction, allReactionWithBlogId };
