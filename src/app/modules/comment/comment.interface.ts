// comment.interface.ts
import { Types } from 'mongoose';

export interface IComment {
  _id?: Types.ObjectId;
  blogId: Types.ObjectId;
  userId?: Types.ObjectId;
  content: string;
  parentId?: Types.ObjectId | null; // null means top-level comment
  likes?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
