import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../../config/env";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchableFields } from "./user.constant";
import { IAuthProvider, IUser, Role } from "./user.interface";
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
   * user can update :  password, name etc.
   * password --> for update need rehashing
   * Only admin can update isBlock, role
   */

  // Admin and admin je karo info update korte pare. But jodi role user hoi tahole se sudho nijer profile update korte parbe. Onno karo profile change korte parbena.
  if (decodedToken.role == Role.USER ) {
    if (userId !== decodedToken.userId) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  // user exist naki, check korbo
  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not exist");
  }


  // payload er moddhe role property thakle vitore dhukbe.
  if (payload.role) {
    // decodedToken or request kora user er role jodi user hoi. Tahole role ke update korte parbena.
    if (decodedToken.role === Role.USER ) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
    // decodedToken or request kora user er role jodi admin hoi. Tahole superAdmin er kono kiso update korte parbena sei admin. Tai check kortesi payload a asa role er value ki superAdmin naki.
    if (decodedToken.role === Role.USER && payload.role === Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  // isActive, isDeleted, isVerified property gulo sudho admin or super admin update korte parbe.
  if (payload.isBlock) {
    if (decodedToken.role === Role.USER) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }


  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true, // update hoia updated info gulo newUpdatedUser er moddhe asbe.
    runValidators: true, // runValidators er maddhome mongoose er schema check kore update hobe. Ai property true na korle mongoose er schema check na kore set hoia jabe.
  });

  return newUpdatedUser;
};

const getAllUser = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find(), query);
  const users = await queryBuilder
    .search(userSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    users.build(),
    queryBuilder.getMeta(),
  ]);
  return {
    meta,
    data,
  };
};

const getSingleUser = async (id: string) => {
  // find korar por .select("-password") --> dara bujhai password field ta bade all field get hobe. Ar minus symboll na dila, sudho password field tai get hoto.
  const user = await User.findById(id).select("-password");

  return {
    data: user,
  };
};

const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password");

  return {
    data: user,
  };
};
export const UserServices = {
  createUser,
  getAllUser,
  updateUser,
  getSingleUser,
  getMe,
};
