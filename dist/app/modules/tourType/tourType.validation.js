"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTourTypeZodSchema = exports.createTourTypeZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createTourTypeZodSchema = zod_1.default.object({
    name: zod_1.default.string({ invalid_type_error: "Tour type must have string" }),
});
exports.updateTourTypeZodSchema = zod_1.default.object({
    name: zod_1.default.string({ invalid_type_error: "Tour type must have string" }),
});
