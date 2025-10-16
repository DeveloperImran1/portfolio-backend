"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
// comment.model.ts
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    blogId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true,
        index: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    parentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null,
    },
    likes: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true, // createdAt, updatedAt
    versionKey: false,
});
// Optional: compound index to query top-level comments faster
commentSchema.index({ blogId: 1, parentId: 1, createdAt: -1 });
exports.Comment = (0, mongoose_1.model)('Comment', commentSchema);
