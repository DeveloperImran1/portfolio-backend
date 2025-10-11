import { Types } from "mongoose";

export interface IAuthProvider {
  provider: "google" | "credentials"; // "google", "credential"
  providerId: string;
}

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}
export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  picture?: string;
  isBlock?: boolean;
  
  role: Role;
  auths: IAuthProvider[]; // amader website a sudho google and email-pass ai 2way te login korte parbe. Kiso kiso user ase, jara email dia login kore, edit profile theke password set kore, tai auths property er value akta array hobe. Kono user jodi google dia login kore, tahole google info thakbe 1st index a. Ar 2nd index a email-pass er info thakbe.
 
  createdAt?: Date;
  updatedAt?: Date;
}
