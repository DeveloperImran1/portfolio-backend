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
exports.BlogServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const cloudinary_config_1 = require("../../../config/cloudinary.config");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const user_model_1 = require("../user/user.model");
const blog_constant_1 = require("./blog.constant");
const blog_model_1 = require("./blog.model");
const createBlog = (paylaod, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(decodedToken.userId);
    const blogData = Object.assign(Object.assign({}, paylaod), { authorId: user === null || user === void 0 ? void 0 : user._id, authorPhoto: user === null || user === void 0 ? void 0 : user.picture });
    const blog = yield blog_model_1.Blog.create(blogData);
    return blog;
});
const updateBlog = (blogId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // ai condition check na korleo hobe. Because zod schemate slug ke remove koresi. Thts mean front-end theke slug field aslew, zod schemar maddhome slug field remove hoia aikhane asbe.
    if (payload.slug) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'You cannot modify slug');
    }
    if (payload.views || payload.reactionsCount || payload.commentCount) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'You donot modify this field');
    }
    const isBlogExist = yield blog_model_1.Blog.findById(blogId);
    if (!isBlogExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'This blog not exist');
    }
    //
    if (payload.title && !payload.slug) {
        payload.slug = payload.title.toLowerCase().replace(/\s+/g, '-');
    }
    if (payload.content) {
        const words = payload.content.trim().split(/\s+/).length;
        const minutes = Math.ceil(words / 50);
        payload.readTime = `${minutes} min read`;
    }
    const newUpdateBlog = yield blog_model_1.Blog.findByIdAndUpdate(blogId, payload, {
        new: true,
        runValidators: true,
    });
    // division update hower pore previous image ke delete korte hobe.
    if (payload.thumbnail && isBlogExist.thumbnail) {
        yield (0, cloudinary_config_1.deleteImageFromCloudinary)(isBlogExist.thumbnail);
    }
    return newUpdateBlog;
});
const deleteBlog = (blogId) => __awaiter(void 0, void 0, void 0, function* () {
    const isBlogExist = yield blog_model_1.Blog.findById(blogId);
    if (!isBlogExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'This blog not exist');
    }
    const deleteBlog = yield blog_model_1.Blog.findByIdAndDelete(blogId);
    return deleteBlog;
});
const getAllBlog = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(blog_model_1.Blog.find(), query);
    const division = yield queryBuilder
        .search(blog_constant_1.blogSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        division.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        meta,
        data,
    };
});
const getSingleBlog = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_model_1.Blog.findOne({ slug });
    return {
        data: blog,
    };
});
const getAllFeaturedBlog = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(blog_model_1.Blog.find(), query);
    const division = yield queryBuilder
        .search(blog_constant_1.blogSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        division.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        meta,
        data,
    };
});
exports.BlogServices = {
    createBlog,
    updateBlog,
    deleteBlog,
    getAllBlog,
    getSingleBlog,
    getAllFeaturedBlog,
};
