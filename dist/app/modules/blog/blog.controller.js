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
exports.BlogController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const blog_services_1 = require("./blog.services");
const createBlog = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // jeheto req.file.path er moddhe upload kora imageer link pawa jabe. Tai oi image ta ke thumbnail property er moddhe set kore dibo.
    const paylaod = Object.assign(Object.assign({}, req.body), { thumbnail: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path });
    const decodedToken = req.user;
    const blog = yield blog_services_1.BlogServices.createBlog(paylaod, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: 'Blog created successfully',
        data: { blog },
    });
}));
const updateBlog = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const blogId = req.params.id;
    let payload;
    if ((_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path) {
        payload = Object.assign(Object.assign({}, req.body), { thumbnail: (_b = req.file) === null || _b === void 0 ? void 0 : _b.path });
    }
    else {
        payload = req.body;
    }
    const updatedBlog = yield blog_services_1.BlogServices.updateBlog(blogId, payload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Blog updated successfully',
        data: updateBlog,
    });
}));
const deleteBlog = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = req.params.id;
    const deleteBlog = yield blog_services_1.BlogServices.deleteBlog(blogId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Blog deleted successfully',
        data: deleteBlog,
    });
}));
const getAllBlog = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_services_1.BlogServices.getAllBlog(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Blog retrived successfully',
        data: blog,
    });
}));
const getSingleBlog = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    const blog = yield blog_services_1.BlogServices.getSingleBlog(slug);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Blog retrived successfully',
        data: blog,
    });
}));
exports.BlogController = {
    createBlog,
    updateBlog,
    deleteBlog,
    getAllBlog,
    getSingleBlog,
};
