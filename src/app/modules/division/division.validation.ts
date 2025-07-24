import z from "zod";

export const createDivisionZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Division must be a string" })
    .min(2, { message: "Minimum length is 2" })
    .max(30, { message: "Maximum length is 30" }),

  slug: z.string({ invalid_type_error: "Slug must be string" }).optional(),
  thumbnail: z
    .string({ invalid_type_error: "Thumbnail must be a string" })
    .optional(),
  description: z
    .string({ invalid_type_error: "Description must be a string" })
    .optional(),
});

export const updateDivisionZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Division must be a string" })
    .min(2, { message: "Minimum length is 2" })
    .max(30, { message: "Maximum length is 30" })
    .optional(),

  //   slug: z.string({ invalid_type_error: "Slug must be string" }).optional(), // front-end theke user slug ke update korte parbena. Sudho backend a automatic name er upor depend kore update hobe.
  thumbnail: z
    .string({ invalid_type_error: "Thumbnail must be a string" })
    .optional(),
  description: z
    .string({ invalid_type_error: "Description must be a string" })
    .optional(),
});
