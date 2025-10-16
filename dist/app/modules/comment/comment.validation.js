"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommentZodSchema = exports.createCommentZodSchema = void 0;
// comment.validation.ts
const zod_1 = require("zod");
/**
 * Simple ObjectId regex check for incoming string ids.
 * Note: This only validates format (24 hex chars). Full existence should be checked server-side.
 */
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
exports.createCommentZodSchema = zod_1.z.object({
    blogId: zod_1.z
        .string({ required_error: 'blogId is required' })
        .regex(objectIdRegex, 'Invalid blogId (must be a Mongo ObjectId)'),
    content: zod_1.z
        .string({ required_error: 'Content is required' })
        .min(1, 'Content cannot be empty')
        .max(2000, 'Content is too long'),
    parentId: zod_1.z
        .string()
        .regex(objectIdRegex, 'Invalid parentId (must be a Mongo ObjectId)')
        .nullable()
        .optional(),
    // likes should usually be controlled by server logic, but accept optional numeric if needed
    likes: zod_1.z.number().int().nonnegative().optional(),
});
exports.updateCommentZodSchema = zod_1.z.object({
    content: zod_1.z.string().min(1, 'Content cannot be empty').max(2000).optional(),
    likes: zod_1.z.number().int().nonnegative().optional(),
});
