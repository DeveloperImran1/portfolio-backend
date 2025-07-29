"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTourZodSchema = exports.createTourZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createTourZodSchema = zod_1.default.object({
    title: zod_1.default
        .string({ invalid_type_error: "Title must be a string" })
        .min(2, { message: "Minimum length is 2" }),
    description: zod_1.default
        .string({ invalid_type_error: "Description must be a string" })
        .optional(),
    images: zod_1.default
        .array(zod_1.default.string({ invalid_type_error: "Description must be a string" }))
        .optional(),
    location: zod_1.default
        .string({ invalid_type_error: "Description must be a string" })
        .optional(),
    costFrom: zod_1.default
        .number({ invalid_type_error: "Cost must be a number" })
        .optional(),
    startDate: zod_1.default
        .string({ invalid_type_error: "Start Date must be a string" })
        .optional(),
    endDate: zod_1.default
        .string({ invalid_type_error: "End Date must be a string" })
        .optional(),
    included: zod_1.default
        .array(zod_1.default.string({ invalid_type_error: "Include value must be a string" }))
        .optional(),
    excluded: zod_1.default
        .array(zod_1.default.string({ invalid_type_error: "Exclude value must be a string" }))
        .optional(),
    amenities: zod_1.default
        .array(zod_1.default.string({ invalid_type_error: "Amenities value must be a string" }))
        .optional(),
    tourPlan: zod_1.default
        .number({ invalid_type_error: "tourPlan must be a number" })
        .optional(),
    maxGuest: zod_1.default
        .number({ invalid_type_error: "maxGuest must be a number" })
        .optional(),
    minAge: zod_1.default
        .number({ invalid_type_error: "minAge must be a number" })
        .optional(),
    division: zod_1.default
        .string({ invalid_type_error: "division value must be a string" })
        .min(1, { message: "Division field is required" }),
    tourType: zod_1.default
        .string({ invalid_type_error: "tourType value must be a string" })
        .min(1, { message: "Tour Type field is required" }),
    departureLocation: zod_1.default.string({
        invalid_type_error: "departureLocation value must be a string",
    }),
    arrivalLocation: zod_1.default.string({
        invalid_type_error: "arrivalLocation value must be a string",
    }),
});
exports.updateTourZodSchema = zod_1.default.object({
    title: zod_1.default
        .string({ invalid_type_error: "Title must be a string" })
        .min(2, { message: "Minimum length is 2" })
        .optional(),
    description: zod_1.default
        .string({ invalid_type_error: "Description must be a string" })
        .optional(),
    images: zod_1.default
        .array(zod_1.default.string({ invalid_type_error: "Description must be a string" }))
        .optional(),
    location: zod_1.default
        .string({ invalid_type_error: "Description must be a string" })
        .optional(),
    costFrom: zod_1.default
        .number({ invalid_type_error: "Cost must be a number" })
        .optional(),
    startDate: zod_1.default
        .string({ invalid_type_error: "Start Date must be a string" })
        .optional(),
    endDate: zod_1.default
        .string({ invalid_type_error: "End Date must be a string" })
        .optional(),
    included: zod_1.default
        .array(zod_1.default.string({ invalid_type_error: "Include value must be a string" }))
        .optional(),
    excluded: zod_1.default
        .array(zod_1.default.string({ invalid_type_error: "Exclude value must be a string" }))
        .optional(),
    amenities: zod_1.default
        .array(zod_1.default.string({ invalid_type_error: "Amenities value must be a string" }))
        .optional(),
    tourPlan: zod_1.default
        .number({ invalid_type_error: "tourPlan must be a number" })
        .optional(),
    maxGuest: zod_1.default
        .number({ invalid_type_error: "maxGuest must be a number" })
        .optional(),
    minAge: zod_1.default
        .number({ invalid_type_error: "minAge must be a number" })
        .optional(),
    division: zod_1.default
        .string({ invalid_type_error: "division value must be a string" })
        .min(1, { message: "Division field is required" })
        .optional(),
    tourType: zod_1.default
        .string({ invalid_type_error: "tourType value must be a string" })
        .min(1, { message: "Tour Type field is required" })
        .optional(),
    deleteImages: zod_1.default.array(zod_1.default.string()).optional(),
});
