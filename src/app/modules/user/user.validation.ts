import z from "zod";

export const createUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must have been string" })
    .min(3, { message: "Name lenght is minimum 3" })
    .max(100, { message: "Name length maximum 100" }),
  email: z
    .string({ invalid_type_error: "Email must have been string" })
    .email({ message: "Invalid email address format" })
    .min(5, { message: "Email lenght is minimum 5" })
    .max(100, { message: "Email length maximum 100" }),
  password: z
    .string({ invalid_type_error: "Password must be a string" })
    .min(8, { message: "Password must have 8 charecter long" })
});

export const updateUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must have been string" })
    .min(3, { message: "Name lenght is minimum 3" })
    .max(100, { message: "Name length maximum 100" })
    .optional(),

  isBlock: z
    .boolean({
      invalid_type_error: "isBlock value must be an boolean",
    })
    .optional(),
});
