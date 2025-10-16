"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogZodSchema = exports.createBlogZodSchema = void 0;
const zod_1 = require("zod");
// ✅ Zod schema for creating a blog
exports.createBlogZodSchema = zod_1.z.object({
    title: zod_1.z
        .string({ required_error: 'Title is required' })
        .min(3, 'Title must be at least 3 characters long'),
    content: zod_1.z
        .string({ required_error: 'Content is required' })
        .min(20, 'Content should be at least 20 characters long'),
    tags: zod_1.z.array(zod_1.z.string()).nonempty('At least one tag is required').optional(),
    isFeatured: zod_1.z.boolean().optional(),
    category: zod_1.z
        .string({ required_error: 'Category is required' })
        .min(2, 'Category must be at least 2 characters'),
});
// ✅ Zod schema for updating a blog
exports.updateBlogZodSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    content: zod_1.z.string().optional(),
    thumbnail: zod_1.z.string().url().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    isFeatured: zod_1.z.boolean().optional(),
    views: zod_1.z.number().optional(),
    readTime: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    reactionsCount: zod_1.z
        .object({
        like: zod_1.z.number().optional(),
        love: zod_1.z.number().optional(),
        wow: zod_1.z.number().optional(),
    })
        .optional(),
    commentCount: zod_1.z.number().optional(),
});
