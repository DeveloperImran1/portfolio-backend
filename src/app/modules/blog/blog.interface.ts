import { Types } from 'mongoose';

export interface IBlog {
  _id?: Types.ObjectId; // optional because MongoDB generates it automatically
  title: string;
  slug?: string;
  content: string;
  thumbnail?: string;
  tags: string[];
  authorId: Types.ObjectId;
  authorPhoto: string;
  isFeatured?: boolean; // default handled by schema
  views?: number;
  readTime?: string;
  category: string;
  reactionsCount?: {
    like: number;
    love: number;
    wow: number;
  };
  commentCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
