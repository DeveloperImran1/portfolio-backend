import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z.object({
    firstName: z
      .string({ invalid_type_error: "Name must have been string" })
      .min(1, { message: "Name lenght is minimum 5" })
      .max(100, { message: "Name length maximum 100" }),
    lastName: z
      .string({ invalid_type_error: "Name must have been string" })
      .min(1, { message: "Name lenght is minimum 5" })
      .max(100, { message: "Name length maximum 100" }),
  }),
  email: z
    .string({ invalid_type_error: "Email must have been string" })
    .email({ message: "Invalid email address format" })
    .min(5, { message: "Email lenght is minimum 5" })
    .max(100, { message: "Email length maximum 100" }),
  password: z
    .string({ invalid_type_error: "Password must be a string" })
    .min(8, { message: "Password must have 8 charecter long" })
    .regex(/(?=.*[A-Z])/, {
      message: "Password include atleast 1 uppercase",
    })
    .regex(/(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/, {
      message: "Password include atleast special charrecter",
    })
    .regex(/(?=.*\d)/, { message: "Password include atleast 1 number" }),
  phone: z
    .string({ invalid_type_error: "Phone number must be string" })
    .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
      message: "Invalid Phone number",
    })
    .optional(),
  address: z
    .string({ invalid_type_error: "Address must have string" })
    .max(200, { message: "Address length maximum 200 charrecter" })
    .optional(),
});

export const updateUserZodSchema = z.object({
  password: z
    .string({ invalid_type_error: "Password must be a string" })
    .min(8, { message: "Password must have 8 charecter long" })
    .regex(/(?=.*[A-Z])/, {
      message: "Password include atleast 1 uppercase",
    })
    .regex(/(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/, {
      message: "Password include atleast special charrecter",
    })
    .regex(/(?=.*\d)/, { message: "Password include atleast 1 number" })
    .optional(),
  phone: z
    .string({ invalid_type_error: "Phone number must be string" })
    .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
      message: "Invalid Phone number",
    })
    .optional(),
  address: z
    .string({ invalid_type_error: "Address must have string" })
    .max(200, { message: "Address length maximum 200 charrecter" })
    .optional(),

  role: z
    // .enum(["SUPER_ADMIN", "ADMIN", "USER", "GUIDE"])  // ---> Aivabe likhlew hoto. But already Role er type declare kora ase, Tai Object.Keys er maddhome koreci.
    .enum(Object.values(Role) as [string])
    .optional(),
  isActive: z.enum(Object.keys(IsActive) as [string]).optional(),
  isVerified: z
    .boolean({
      invalid_type_error: "isVarified value must be an boolean",
    })
    .optional(),
  isDeleted: z
    .boolean({
      invalid_type_error: "isDeleted value must be an boolean",
    })
    .optional(),
  //  name: string;

  //  picture?: string;
});
