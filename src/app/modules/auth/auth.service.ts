/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../../config/env";
import AppError from "../../errorHelpers/AppError";
import { createNewAccessTokenWithRefreshToken } from "../../utils/userTokens";
import { User } from "../user/user.model";

// credentialsLogin er moddher all kaj passport.ts file er moddhe kora hoiase. Because google login kora user der ke condition dia lagin er kaj korasse.
// const credentialsLogin = async (payload: Partial<IUser>) => {
//   const { email, password } = payload;

//   const isUserExist = await User.findOne({ email });
//   if (!isUserExist) {
//     throw new AppError(httpStatus.BAD_REQUEST, "User not found");
//   }

//   const isPasswordMatched = await bcrypt.compare(
//     password as string,
//     isUserExist.password as string
//   );

//   if (!isPasswordMatched) {
//     throw new AppError(httpStatus.BAD_GATEWAY, "Invalid Password");
//   }

//   //  token create
//   const userToken = createUserTokens(isUserExist);

//   // isUserExist er moddhe user er all data ase. But password front-end a send na korai better. Tai isUserExist theke password property ke delete korbo.
//   const { password: pass, ...rest } = isUserExist.toObject();

//   // user login korar pore ai object ta front-end a jabe. ai token gulo nia cookie te set kora rakhte  hobe.
//   return {
//     accessToken: userToken.accessToken,
//     refreshToken: userToken.refreshToken,
//     user: rest,
//   };
// };

// new token generate using refresh token
const getNewAccessToken = async (refreshToken: string) => {
  // refresh token dia new akta token create korar kaj ta utils > userTokens.ts file er moddhe akta function a koreci.
  const accessToken = await createNewAccessTokenWithRefreshToken(refreshToken);
  return {
    accessToken,
  };
};

const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);

  const isOldPasswordMatch = await bcrypt.compare(
    oldPassword,
    user?.password as string
  );

  if (!isOldPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, "Your old password not matched!");
  }

  // aikhane user null hobena, aita bujhar jonno not null assertion symbol (!) use koreci. ar hash kora password ke user.password er moddhe bose, save() kore diasi.
  user!.password = await bcrypt.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  user!.save();
};

export const AuthServices = {
  // credentialsLogin,
  getNewAccessToken,
  resetPassword,
};
