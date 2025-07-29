"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDivisionZodSchema = exports.createDivisionZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createDivisionZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Division must be a string" })
        .min(2, { message: "Minimum length is 2" })
        .max(30, { message: "Maximum length is 30" }),
    slug: zod_1.default.string({ invalid_type_error: "Slug must be string" }).optional(),
    thumbnail: zod_1.default
        .string({ invalid_type_error: "Thumbnail must be a string" })
        .optional(),
    description: zod_1.default
        .string({ invalid_type_error: "Description must be a string" })
        .optional(),
});
exports.updateDivisionZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Division must be a string" })
        .min(2, { message: "Minimum length is 2" })
        .max(30, { message: "Maximum length is 30" })
        .optional(),
    //   slug: z.string({ invalid_type_error: "Slug must be string" }).optional(), // front-end theke user slug ke update korte parbena. Sudho backend a automatic name er upor depend kore update hobe.
    thumbnail: zod_1.default
        .string({ invalid_type_error: "Thumbnail must be a string" })
        .optional(),
    description: zod_1.default
        .string({ invalid_type_error: "Description must be a string" })
        .optional(),
});
