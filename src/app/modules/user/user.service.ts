import { IUser } from "./user.interface";
import { User } from "./user.model";

// Aikhane Partial<IUser> dara bujasse, Iuser interface er type gulote jei property ase, exact all property na thake similar kiso property thakbe.
const createUser = async (payload: Partial<IUser>) => {
  const { name, email, auths } = payload;
  const user = await User.create({ name, email, auths });

  return user;
};

export const UserServices = { createUser };
