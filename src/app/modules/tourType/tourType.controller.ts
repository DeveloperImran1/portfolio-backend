/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TourTypeServices } from "./tourType.services";

const createTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourType = await TourTypeServices.createTourType(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Tour Type created successfully",
      data: tourType,
    });
  }
);

const getAllTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourType = await TourTypeServices.getAllTourType();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Tour Type retrived successfully",
      data: tourType,
    });
  }
);

const getSingleTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const tourType = await TourTypeServices.getSingleTourType(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Tour Type retrived successfully",
      data: tourType,
    });
  }
);

const updateTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourTypeId = req.params.id;
    const payload = req.body;
    const tourType = await TourTypeServices.updateTourType(tourTypeId, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Tour Type updated successfully",
      data: tourType,
    });
  }
);

const deleteTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourTypeId = req.params.id;
    await TourTypeServices.deleteTourType(tourTypeId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Tour Type deleted successfully",
      data: null,
    });
  }
);

export const TourTypeController = {
  createTourType,
  getAllTourType,
  updateTourType,
  deleteTourType,
  getSingleTourType,
};
