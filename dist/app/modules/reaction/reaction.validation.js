"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReactionZodSchema = void 0;
const zod_1 = require("zod");
exports.createReactionZodSchema = zod_1.z.object({
    blogId: zod_1.z.string({ required_error: 'Blog ID is required' }),
    type: zod_1.z.enum(['like', 'love', 'wow'], {
        required_error: 'Reaction type is required',
    }),
});
