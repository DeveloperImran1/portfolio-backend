import z from "zod";

export const createTourZodSchema = z.object({
  title: z
    .string({ invalid_type_error: "Title must be a string" })
    .min(2, { message: "Minimum length is 2" }),

  description: z
    .string({ invalid_type_error: "Description must be a string" })
    .optional(),

  images: z
    .array(z.string({ invalid_type_error: "Description must be a string" }))
    .optional(),
  location: z
    .string({ invalid_type_error: "Description must be a string" })
    .optional(),
  costFrom: z
    .number({ invalid_type_error: "Cost must be a number" })
    .optional(),
  startDate: z
    .string({ invalid_type_error: "Start Date must be a string" })
    .optional(),
  endDate: z
    .string({ invalid_type_error: "End Date must be a string" })
    .optional(),
  included: z
    .array(z.string({ invalid_type_error: "Include value must be a string" }))
    .optional(),
  excluded: z
    .array(z.string({ invalid_type_error: "Exclude value must be a string" }))
    .optional(),
  amenities: z
    .array(z.string({ invalid_type_error: "Amenities value must be a string" }))
    .optional(),
  tourPlan: z
    .number({ invalid_type_error: "tourPlan must be a number" })
    .optional(),
  maxGuest: z
    .number({ invalid_type_error: "maxGuest must be a number" })
    .optional(),
  minAge: z
    .number({ invalid_type_error: "minAge must be a number" })
    .optional(),
  division: z
    .string({ invalid_type_error: "division value must be a string" })
    .min(1, { message: "Division field is required" }),
  tourType: z
    .string({ invalid_type_error: "tourType value must be a string" })
    .min(1, { message: "Tour Type field is required" }),
  departureLocation: z.string({
    invalid_type_error: "departureLocation value must be a string",
  }),
  arrivalLocation: z.string({
    invalid_type_error: "arrivalLocation value must be a string",
  }),
});

export const updateTourZodSchema = z.object({
  title: z
    .string({ invalid_type_error: "Title must be a string" })
    .min(2, { message: "Minimum length is 2" })
    .optional(),

  description: z
    .string({ invalid_type_error: "Description must be a string" })
    .optional(),

  images: z
    .array(z.string({ invalid_type_error: "Description must be a string" }))
    .optional(),
  location: z
    .string({ invalid_type_error: "Description must be a string" })
    .optional(),
  costFrom: z
    .number({ invalid_type_error: "Cost must be a number" })
    .optional(),
  startDate: z
    .string({ invalid_type_error: "Start Date must be a string" })
    .optional(),
  endDate: z
    .string({ invalid_type_error: "End Date must be a string" })
    .optional(),
  included: z
    .array(z.string({ invalid_type_error: "Include value must be a string" }))
    .optional(),
  excluded: z
    .array(z.string({ invalid_type_error: "Exclude value must be a string" }))
    .optional(),
  amenities: z
    .array(z.string({ invalid_type_error: "Amenities value must be a string" }))
    .optional(),
  tourPlan: z
    .number({ invalid_type_error: "tourPlan must be a number" })
    .optional(),
  maxGuest: z
    .number({ invalid_type_error: "maxGuest must be a number" })
    .optional(),
  minAge: z
    .number({ invalid_type_error: "minAge must be a number" })
    .optional(),
  division: z
    .string({ invalid_type_error: "division value must be a string" })
    .min(1, { message: "Division field is required" })
    .optional(),
  tourType: z
    .string({ invalid_type_error: "tourType value must be a string" })
    .min(1, { message: "Tour Type field is required" })
    .optional(),
  deleteImages: z.array(z.string()).optional(),
});
