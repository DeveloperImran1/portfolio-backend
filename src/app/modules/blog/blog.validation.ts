import { z } from 'zod';

// ✅ Zod schema for creating a blog
export const createBlogZodSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(3, 'Title must be at least 3 characters long'),

  content: z
    .string({ required_error: 'Content is required' })
    .min(20, 'Content should be at least 20 characters long'),

  tags: z.array(z.string()).nonempty('At least one tag is required').optional(),

  isFeatured: z.boolean().optional(),

  category: z
    .string({ required_error: 'Category is required' })
    .min(2, 'Category must be at least 2 characters'),
});

// ✅ Zod schema for updating a blog
export const updateBlogZodSchema = z.object({
  title: z.string().optional(),

  content: z.string().optional(),
  thumbnail: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  views: z.number().optional(),
  readTime: z.string().optional(),
  category: z.string().optional(),
  reactionsCount: z
    .object({
      like: z.number().optional(),
      love: z.number().optional(),
      wow: z.number().optional(),
    })
    .optional(),
  commentCount: z.number().optional(),
});
