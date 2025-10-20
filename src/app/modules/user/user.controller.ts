/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { setAuthCookie } from '../../utils/setCookie';
import { createUserTokens } from '../../utils/userTokens';
import { UserServices } from './user.service';

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log('body is ', req.body);
    const user = await UserServices.createUser(req.body);

    // user thakle user er info dia token create
    const userTokens = createUserTokens(user);

    // cookie te set kortesi
    setAuthCookie(res, userTokens);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User created Successfully',
      data: user,
    });
  },
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload = { ...req.body, picture: req.file?.path };

    const verifiedToken: any = req.user;

    const user = await UserServices.updateUser(userId, payload, verifiedToken);

    // sendResponse utils using res send
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User Updated Successfully',
      data: user,
    });
  },
);

// get all users
const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await UserServices.getAllUser(
      req.query as Record<string, string>,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User retrived Successfully',
      data,
    });
  },
);

const getSingleUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const user = await UserServices.getSingleUser(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User retrived successfully',
      data: user,
    });
  },
);

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const user = await UserServices.getMe(decodedToken.userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User retrived successfully',
      data: user,
    });
  },
);

export const UserControllers = {
  createUser,
  getAllUser,
  updateUser,
  getSingleUser,
  getMe,
};
