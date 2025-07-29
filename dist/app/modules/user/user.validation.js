"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Name must have been string" })
        .min(1, { message: "Name lenght is minimum 5" })
        .max(100, { message: "Name length maximum 100" }),
    email: zod_1.default
        .string({ invalid_type_error: "Email must have been string" })
        .email({ message: "Invalid email address format" })
        .min(5, { message: "Email lenght is minimum 5" })
        .max(100, { message: "Email length maximum 100" }),
    password: zod_1.default
        .string({ invalid_type_error: "Password must be a string" })
        .min(8, { message: "Password must have 8 charecter long" })
        .regex(/(?=.*[A-Z])/, {
        message: "Password include atleast 1 uppercase",
    })
        .regex(/(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/, {
        message: "Password include atleast special charrecter",
    })
        .regex(/(?=.*\d)/, { message: "Password include atleast 1 number" }),
    phone: zod_1.default
        .string({ invalid_type_error: "Phone number must be string" })
        .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
        message: "Invalid Phone number",
    })
        .optional(),
    address: zod_1.default
        .string({ invalid_type_error: "Address must have string" })
        .max(200, { message: "Address length maximum 200 charrecter" })
        .optional(),
});
exports.updateUserZodSchema = zod_1.default.object({
    // ai kajta aikhane korbona. Karon password change korar jonno extra api ase. So schema thekew remove kortesi.
    // password: z
    //   .string({ invalid_type_error: "Password must be a string" })
    //   .min(8, { message: "Password must have 8 charecter long" })
    //   .regex(/(?=.*[A-Z])/, {
    //     message: "Password include atleast 1 uppercase",
    //   })
    //   .regex(/(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/, {
    //     message: "Password include atleast special charrecter",
    //   })
    //   .regex(/(?=.*\d)/, { message: "Password include atleast 1 number" })
    //   .optional(),
    phone: zod_1.default
        .string({ invalid_type_error: "Phone number must be string" })
        .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
        message: "Invalid Phone number",
    })
        .optional(),
    address: zod_1.default
        .string({ invalid_type_error: "Address must have string" })
        .max(200, { message: "Address length maximum 200 charrecter" })
        .optional(),
    role: zod_1.default
        // .enum(["SUPER_ADMIN", "ADMIN", "USER", "GUIDE"])  // ---> Aivabe likhlew hoto. But already Role er type declare kora ase, Tai Object.Keys er maddhome koreci.
        .enum(Object.values(user_interface_1.Role))
        .optional(),
    isActive: zod_1.default.enum(Object.keys(user_interface_1.IsActive)).optional(),
    isVerified: zod_1.default
        .boolean({
        invalid_type_error: "isVarified value must be an boolean",
    })
        .optional(),
    isDeleted: zod_1.default
        .boolean({
        invalid_type_error: "isDeleted value must be an boolean",
    })
        .optional(),
    //  name: string;
    //  picture?: string;
});
