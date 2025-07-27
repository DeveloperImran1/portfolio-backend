/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { DivisionServices } from "./division.services";

const createDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // jeheto req.file.path er moddhe upload kora imageer link pawa jabe. Tai oi image ta ke thumbnail property er moddhe set kore dibo.
    const paylaod = { ...req.body, thumbnail: req.file?.path };
    const division = await DivisionServices.createDivision(paylaod);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Division created successfully",
      data: { division },
    });
  }
);

const getAllDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const division = await DivisionServices.getAllDivision(
      req.query as Record<string, string>
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Division retrived successfully",
      data: division,
    });
  }
);

const getSingleDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const division = await DivisionServices.getSingleDivision(slug);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Division retrived successfully",
      data: division,
    });
  }
);

const updateDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const divisionId = req.params.id;

    const payload = { ...req.body, thumbnail: req.file?.path };
    const updateDivision = await DivisionServices.updateDivision(
      divisionId,
      payload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Division updated successfully",
      data: updateDivision,
    });
  }
);

const deleteDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const divisionId = req.params.id;

    await DivisionServices.deleteDivision(divisionId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Division updated successfully",
      data: null,
    });
  }
);

export const DivisionController = {
  createDivision,
  getAllDivision,
  updateDivision,
  deleteDivision,
  getSingleDivision,
};
