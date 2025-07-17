import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";

// Aikhane Partial<IUser> dara bujasse, Iuser interface er type gulote jei property ase, exact all property na thake similar kiso property thakbe.
const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });
  // if (isUserExist) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "User already exist");
  // }
  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const hashPassword = await bcrypt.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const user = await User.create({
    email,
    password: hashPassword,
    auths: authProvider,
    ...rest,
  });

  return user;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  /**
   * email --> cannot update
   * user can update : phone, password, name, address etc.
   * password --> for update need rehashing
   * Only admin and superAdmin can update isDeleted, role
   * Only superAdmin can a user or admin to superAdmin
   */

  // user exist naki, check korbo
  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not exist");
  }
  // payload er moddhe role property thakle vitore dhukbe.
  if (payload.role) {
    // decodedToken or request kora user er role jodi user ba guide hoi. Tahole role ke update korte parbena.
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
    // decodedToken or request kora user er role jodi admin hoi. Tahole superAdmin korte dita parbena. Tai check kortesi payload a asa role er value ki superAdmin naki.
    if (decodedToken.role === Role.ADMIN && payload.role === Role.SUPER_ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  // isActive, isDeleted, isVerified property gulo sudho admin or super admin update korte parbe.
  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  // jodi password ke update korte chai, tahole payloead theke password ta nia encrypt kore abar paylaod a set kore kore diasi.
  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true, // update hoia updated info gulo newUpdatedUser er moddhe asbe.
    runValidators: true, // runValidators er maddhome mongoose er schema check kore update hobe. Ai property true na korle mongoose er schema check na kore set hoia jabe.
  });

  return newUpdatedUser;
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
export const UserServices = { createUser, updateUser, getAllUser };
