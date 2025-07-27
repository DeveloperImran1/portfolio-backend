/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TourServices } from "./tour.services";

const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // req.files property er moddhe all images ase. Seigulo ke map kore images property er moddhe set koresi.
    const paylaod = {
      ...req.body,
      images: (req.files as Express.Multer.File[])?.map((file) => file.path),
    };
    const tour = await TourServices.createTour(paylaod);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Tour created successfully",
      data: tour,
    });
  }
);

const getAllTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // jodi kono object er moddhe kiki field thakbe, ta exactly na jani, tahole Record use korte pari.
    const tour = await TourServices.getAllTour(
      req.query as Record<string, string>
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Tour retrived successfully",
      data: tour,
    });
  }
);

const getSingleTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const tour = await TourServices.getSingleTour(slug);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Tour retrived successfully",
      data: tour,
    });
  }
);

const updateTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourId = req.params.id;

    const payload = {
      ...req.body,
      images: (req.files as Express.Multer.File[])?.map((file) => file.path),
    };

    const tour = await TourServices.updateTour(tourId, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Tour updated successfully",
      data: tour,
    });
  }
);

const deleteTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourId = req.params.id;

    await TourServices.deleteTour(tourId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Tour Deleted Successfully",
      data: null,
    });
  }
);

export const TourController = {
  createTour,
  getAllTour,
  updateTour,
  deleteTour,
  getSingleTour,
};
