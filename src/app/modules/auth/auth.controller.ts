/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Ai auth module er moddhe authenticaiton: login, logout, password reset etc kaj korbo. Aitar jonno extra vabe interface, model or schema create korte hobena. Ai schema, interface user model, interface dia hoia jabe.

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";
import { envVars } from "../../../config/env";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";
import { createUserTokens } from "../../utils/userTokens";
import { AuthServices } from "./auth.service";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {


    //credentialsLogin er maddhe jaja kortam, ta akhon passport.authentecation er moddhe korbo.

    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) {
        // ❌❌❌❌ aivaime error throw kora jabena.
        // throw new AppError(402, "Something went wrong")
        // return new AppError(401, err);
        // next(err)

        // ✅✅✅✅ aivabe error ke return korte hobe passport er moddhe theke
        // return next(err);
        return next(new AppError(401, err));
      }

          console.log("body", req.body)
      if (!user) {
        return next(new AppError(401, info.message));
      }

      // user thakle user er info dia token create
      const userTokens = createUserTokens(user);

      // cookie te set kortesi
      setAuthCookie(res, userTokens);

      // user theke password ke remove kortesi
      const { password, ...rest } = user.toObject();

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User loged in successfull!",
        data: {
          accessToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
          user: rest,
        },
      });
    })(req, res, next); // credentials login aikhane middleware hisabe kaj kortese. but passport.authenticate() oi middleware er moddhe thaka arekti function. So aitake amader call korte hobe. Tasara hobena.
  }
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // amra jokhon login korbo, tokhon refresh token ta client side er browser er cookie te set kore rakhbe. Akhon new Access token generate korar somoi sei refresh token lagbe. Seita amra req.cookies.refreshToken theke nita parbo.
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "No refresh token recived from cookies"
      );
    }
    const tokenInfo = await AuthServices.getNewAccessToken(
      refreshToken as string
    );

    // refresh token er moaddhome jokhon new token create korteci, tokhon sei token ta responce hisabe client side a pathassi. But cookie te new access-token ta set kore dita hobe. Tai aikhane res send korar age updated token ta cookie te set kore disi.
    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "New Access Token Retrived Successfully",
      data: tokenInfo,
    });
  }
);

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Kono user Login ase kina seita ensure hote pari, browser er cookie te accessToken and refreshToken ase kina. Seita check kori. So logout korar jonno accessToken and refreshToken remove korte parle kella fote.
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Logged Out Successfully",
      data: null,
    });
  }
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;

    await AuthServices.resetPassword(req.body, decodedToken as JwtPayload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password Reset Successfully",
      data: null,
    });
  }
);

const setPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const { password } = req.body;

    await AuthServices.setPassword(decodedToken.userId, password);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password set Successfully",
      data: null,
    });
  }
);

const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    await AuthServices.forgotPassword(email);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Email Send Successfully",
      data: null,
    });
  }
);

const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // auth.controller a asar age checkAuth middleware a giasilo. Then next() er maddhome ai controller a asce. So checkAuth er moddhe token ke docode kore user er info gulo req.user property er moddhe set kore diase. Tai aikhane distructure kore nissi.
    const decodedToken = req.user;

    const newPassword = req?.body?.newPassword;
    const oldPassword = req?.body?.oldPassword;



    if (!newPassword || !oldPassword) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Old password and new password field is required"
      );
    }

    await AuthServices.changePassword(oldPassword, newPassword, decodedToken as JwtPayload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password Reset Successfully",
      data: null,
    });
  }
);

const googleCallbackcontroller = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // amra credential dia login korar somoi, req.user er moddhe user er data gulo set kore ditam. But config > passport.ts file a passport er maddhome login korai. Passport ai req.user namer akta propety er moddhe user er value set kore dei automatically.
    const user = req.user;

    // google dia login korar korar somoi route a state namer akta property er moddhe redirect path te set koreci, jar fole aikhane query theke state name a value ta pabo.
    let redirectTo = req.query.state ? (req.query.state as string) : "";
    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    // user thakle user er moddhe email, name, _id, role etc. ase. Oi user er value dia createUserTokens() function accessToken and refreshToken create kore diba.
    const tokenInfo = createUserTokens(user);

    // token create kora done, akhon ai token gulo cookie te set kore diba setAuthCookie function.
    setAuthCookie(res, tokenInfo);

    // sendResponse(res, {
    //   success: true,
    //   statusCode: httpStatus.OK,
    //   message: "Password Reset Successfully",
    //   data: null,
    // });

    // login hower pore front-end a res send korte hobena. redirect kore dilai hobe. Akhon redirectTo er value thakle user er exptectation route a redirect korbe. ar redirectTo empty string hole home page a redirect korbe.
    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  }
);

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  setPassword,
  changePassword,
  googleCallbackcontroller,
  forgotPassword,
};
