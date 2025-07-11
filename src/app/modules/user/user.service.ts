import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import { envVars } from "../../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";

// Aikhane Partial<IUser> dara bujasse, Iuser interface er type gulote jei property ase, exact all property na thake similar kiso property thakbe.
const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exist");
  }
  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const hashPassword = await bcrypt.hash(
    password as string,
    envVars.BCRYPT_SALT_ROUND
  );

  const user = await User.create({
    email,
    password: hashPassword,
    auths: authProvider,
    ...rest,
  });

  return user;
};

const getAllUser = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments();

  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};
export const UserServices = { createUser, getAllUser };
