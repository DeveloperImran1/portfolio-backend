"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reaction = void 0;
const mongoose_1 = require("mongoose");
const reactionSchema = new mongoose_1.Schema({
    blogId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['like', 'love', 'wow'],
        required: true,
    },
}, {
    timestamps: { createdAt: true, updatedAt: false }, // only createdAt
    versionKey: false,
});
// 🔥 Optional: prevent duplicate reactions (same user on same blog)
reactionSchema.index({ blogId: 1, userId: 1 }, { unique: true });
exports.Reaction = (0, mongoose_1.model)('Reaction', reactionSchema);
