/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserServices } from "./user.service";

// // controller er moddhe amra sudho user theke request nibo, client side theke data gulo accept korbo and finaly responce send korbo. Ar query or buisness logic likha DB er sathe communicate korar kaj gulo user.service.ts file a korbo.
// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     // throw new Error("false error!!");
//     // age error throw korle sudho message dita partam perameter a. But errorHelpers > AppError.ts file a AppError namer akta class declare koreci. Jei class Error er all property nia ase and tar sathe statusCode namer akta property set kore. Jeita amra throw new Error() ke call na kore. Akhon AppError ke call korbo. Jar fole statusCode and errorMessage 2tai send korte parbo.
//     // throw new AppError(httpStatus.BAD_REQUEST, "Fake error");

//     const user = await UserServices.createUser(req.body);
//     res.status(httpStatus.CREATED).json({
//       success: true,
//       message: "User created",
//       user,
//     });
//   } catch (error: any) {
//     next(error);
//   }
// };

// ------------> Upore amra normaly try-catch and userServices use kore api create koreci. But akhon repetitive kaj gulo ke akta function er maddhome handle korbo:

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    // age amra aivabe every api theke result ke send kortesilam. But sei kajta akhon sendResponse.ts utils er maddhome aro easily korbo.
    // res.status(httpStatus.CREATED).json({
    //   success: true,
    //   message: "User created",
    //   user,
    // });

    // sendResponse utils using res send
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User created Successfully",
      data: user,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload = req.body;

    // const token = req.headers.authorization as string;
    // const verifiedToken = verifyToken(
    //   token,
    //   envVars.JWT_ACCESS_SECRET
    // ) as JwtPayload;

    // checkAuth.ts file a verifiedToken token ke req.user property er moddhe set koresi. Jar fole uporer moto kore abar verify na kore req.user theke nita partesi.
    const verifiedToken: any = req.user;

    const user = await UserServices.updateUser(userId, payload, verifiedToken);

    // sendResponse utils using res send
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Updated Successfully",
      data: user,
    });
  }
);

// get all users
const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await UserServices.getAllUser(
      req.query as Record<string, string>
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User retrived Successfully",
      data,
    });
  }
);

const getSingleUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const user = await UserServices.getSingleUser(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User retrived successfully",
      data: user,
    });
  }
);

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const user = await UserServices.getMe(decodedToken.userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User retrived successfully",
      data: user,
    });
  }
);

export const UserControllers = {
  createUser,
  getAllUser,
  updateUser,
  getSingleUser,
  getMe,
};
