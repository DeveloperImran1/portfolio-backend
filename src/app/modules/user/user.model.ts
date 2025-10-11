import { model, Schema } from "mongoose";
import { IAuthProvider,  IUser, Role } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  { versionKey: false, _id: false }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    picture: { type: String },
    isBlock: { type: Boolean, default: false },
   
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    auths: {
      type: [authProviderSchema],
    },

  },
  { versionKey: false, timestamps: true }
);

export const User = model<IUser>("User", userSchema);
