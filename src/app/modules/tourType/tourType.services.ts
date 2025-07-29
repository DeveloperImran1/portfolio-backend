import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { ITourType } from "./tourType.interface";
import { TourType } from "./tourType.model";

const createTourType = async (payload: ITourType) => {
  const isTourTypeExist = await TourType.findOne({ name: payload.name });
  if (isTourTypeExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Tour Type already Exist");
  }

  const tourType = await TourType.create(payload);

  return tourType;
};

const getAllTourType = async () => {
  const tourType = await TourType.find();
  const totalTourType = await TourType.countDocuments();
  return {
    data: tourType,
    meta: {
      total: totalTourType,
    },
  };
};

const getSingleTourType = async (id: string) => {
  const tourType = await TourType.findOne({ _id: id });
  return {
    data: tourType,
  };
};

const updateTourType = async (tourTypeId: string, payload: ITourType) => {
  if (!payload.name) {
    throw new AppError(httpStatus.BAD_REQUEST, "Please modify name field");
  }
  const isTourTypeExist = await TourType.findById(tourTypeId);
  if (!isTourTypeExist) {
    throw new AppError(httpStatus.NOT_FOUND, "This Tour Type not found");
  }

  const updateTourType = await TourType.findByIdAndUpdate(tourTypeId, payload, {
    new: true,
    runValidators: true,
  });

  return updateTourType;
};

const deleteTourType = async (tourTypeId: string) => {
  const isTourTypeExist = await TourType.findById(tourTypeId);
  if (!isTourTypeExist) {
    throw new AppError(httpStatus.NOT_FOUND, "This Tour Type not found");
  }

  // ensure koro, ai tourType onno kono collection a refference hisabe add nai. Jodi reference hisabe thake, tahole error message dia return kore daw.
  //
  //
  //

  await TourType.findByIdAndDelete(tourTypeId);

  return;
};

export const TourTypeServices = {
  createTourType,
  getAllTourType,
  updateTourType,
  deleteTourType,
  getSingleTourType,
};
