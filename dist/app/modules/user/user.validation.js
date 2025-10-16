"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Name must have been string" })
        .min(3, { message: "Name lenght is minimum 3" })
        .max(100, { message: "Name length maximum 100" }),
    email: zod_1.default
        .string({ invalid_type_error: "Email must have been string" })
        .email({ message: "Invalid email address format" })
        .min(5, { message: "Email lenght is minimum 5" })
        .max(100, { message: "Email length maximum 100" }),
    password: zod_1.default
        .string({ invalid_type_error: "Password must be a string" })
        .min(8, { message: "Password must have 8 charecter long" })
});
exports.updateUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Name must have been string" })
        .min(3, { message: "Name lenght is minimum 3" })
        .max(100, { message: "Name length maximum 100" })
        .optional(),
    isBlock: zod_1.default
        .boolean({
        invalid_type_error: "isBlock value must be an boolean",
    })
        .optional(),
});
