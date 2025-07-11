// Ai auth module er moddhe authenticaiton: login, logout, password reset etc kaj korbo. Aitar jonno extra vabe interface, model or schema create korte hobena. Ai schema, interface user model, interface dia hoia jabe.

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await AuthServices.credentialsLogin(req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User loged in successfull!",
      data: user,
    });
  }
);

export const AuthControllers = { loginUser };
