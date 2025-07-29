/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatsServices } from "./stats.services";

const getUserStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await StatsServices.getUserStats();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User stats retrived successfully",
      data: tour,
    });
  }
);

const getTourStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await StatsServices.getTourStats();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Tour stats retrived successfully",
      data: tour,
    });
  }
);

const getBookingStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await StatsServices.getBookingStats();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Tour retrived successfully",
      data: tour,
    });
  }
);

const getPaymentStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await StatsServices.getPaymentStats();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Tour retrived successfully",
      data: tour,
    });
  }
);

export const StatsController = {
  getBookingStats,
  getPaymentStats,
  getUserStats,
  getTourStats,
};
