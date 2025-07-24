import z from "zod";

export const createTourTypeZodSchema = z.object({
  name: z.string({ invalid_type_error: "Tour type must have string" }),
});

export const updateTourTypeZodSchema = z.object({
  name: z.string({ invalid_type_error: "Tour type must have string" }),
});
