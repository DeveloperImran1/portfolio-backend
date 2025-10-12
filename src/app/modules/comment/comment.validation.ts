// comment.validation.ts
import { z } from 'zod';

/**
 * Simple ObjectId regex check for incoming string ids.
 * Note: This only validates format (24 hex chars). Full existence should be checked server-side.
 */
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createCommentZodSchema = z.object({
  blogId: z
    .string({ required_error: 'blogId is required' })
    .regex(objectIdRegex, 'Invalid blogId (must be a Mongo ObjectId)'),

  content: z
    .string({ required_error: 'Content is required' })
    .min(1, 'Content cannot be empty')
    .max(2000, 'Content is too long'),
  parentId: z
    .string()
    .regex(objectIdRegex, 'Invalid parentId (must be a Mongo ObjectId)')
    .nullable()
    .optional(),
  // likes should usually be controlled by server logic, but accept optional numeric if needed
  likes: z.number().int().nonnegative().optional(),
});

export const updateCommentZodSchema = z.object({
  content: z.string().min(1, 'Content cannot be empty').max(2000).optional(),
  likes: z.number().int().nonnegative().optional(),
});
