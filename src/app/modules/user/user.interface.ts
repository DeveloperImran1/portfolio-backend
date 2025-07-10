import { Types } from "mongoose";

// Aikhane extravabe enum likhaci. But isActive property er por or symboll diaw likhte partam. Aivabe likhar benifit holo: pore jodi block property er value restricted set korte hoi. Tokhon sudho aikhane BLOCK = "RESTRICTED"  kore dilai. all jaigai reffer hoia jabe. Abar VS code sujjeciton oo dei.
export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCK = "BLOCK",
}

export interface IAuthProvider {
  provider: string; // "google", "credential"
  providerId: string;
}

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  GUIDE = "GUIDE",
}
export interface IUser {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: boolean;
  isActive?: IsActive;
  isVerified?: boolean;
  role: Role;
  auths: IAuthProvider[]; // amader website a sudho google and email-pass ai 2way te login korte parbe. Kiso kiso user ase, jara email dia login kore, edit profile theke password set kore, tai auths property er value akta array hobe. Kono user jodi google dia login kore, tahole google info thakbe 1st index a. Ar 2nd index a email-pass er info thakbe.
  bookings?: Types.ObjectId[];
  guides?: Types.ObjectId[];
}
