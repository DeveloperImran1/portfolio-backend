"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const comment_model_1 = require("./comment.model");
const createComment = (paylaod) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comment_model_1.Comment.create(paylaod);
    return comment;
});
const allCommentWithBlogId = (blogId) => __awaiter(void 0, void 0, void 0, function* () {
    const parentComments = yield comment_model_1.Comment.find({ blogId, parentId: null });
    const commentsWithReplies = yield Promise.all(parentComments.map((parent) => __awaiter(void 0, void 0, void 0, function* () {
        const replies = yield comment_model_1.Comment.find({ parentId: parent._id });
        return Object.assign(Object.assign({}, parent.toObject()), { replies });
    })));
    return commentsWithReplies;
});
const updateComment = (commentId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isCommentExist = yield comment_model_1.Comment.findById(commentId);
    if (!isCommentExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'This parent comment not exist');
    }
    const newUpdateComment = yield comment_model_1.Comment.findByIdAndUpdate(commentId, payload, {
        new: true,
        runValidators: true,
    });
    return newUpdateComment;
});
const deleteComment = (commentId) => __awaiter(void 0, void 0, void 0, function* () {
    const isCommentExist = yield comment_model_1.Comment.findById(commentId);
    if (!isCommentExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'This comment not exist');
    }
    const deleteComment = yield comment_model_1.Comment.findByIdAndDelete(commentId);
    return deleteComment;
});
exports.CommentServices = {
    createComment,
    allCommentWithBlogId,
    updateComment,
    deleteComment,
};
