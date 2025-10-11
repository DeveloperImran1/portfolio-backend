import { z } from 'zod';

export const createReactionZodSchema = z.object({
  blogId: z.string({ required_error: 'Blog ID is required' }),
  type: z.enum(['like', 'love', 'wow'], {
    required_error: 'Reaction type is required',
  }),
});
