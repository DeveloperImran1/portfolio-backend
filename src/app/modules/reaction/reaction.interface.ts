import { Types } from 'mongoose';

export interface IReaction {
  blogId: Types.ObjectId; // reference to Blog
  userId: Types.ObjectId; // reference to User
  type: 'like' | 'love' | 'wow'; // only these 3 allowed
  createdAt?: Date; // will auto-generate
}
