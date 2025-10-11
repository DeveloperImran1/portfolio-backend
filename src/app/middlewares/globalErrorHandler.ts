/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";
import { envVars } from "../../config/env";
import AppError from "../errorHelpers/AppError";
import { handleCastError } from "../helpers/handleCastError";
import { handleDuplicateKeyError } from "../helpers/handleDuplicateError";
import { handleMongooseValidationError } from "../helpers/handleValidationError";
import { handleZodError } from "../helpers/handleZodError";
import { TValidation } from "../interfaces/error.types";

// globalErrorHandler ke middleware er moddhe create koresi and app.ts file a app.use(globalErrorHanlder) koreci. Jar fole every api er last a catch block theke next(error) ke call korle ai globalErrorHandler function ta exicute hobe. So every api a ar extra vabe error handle korte hobena.
export const globalErrorHandler = async (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /**
   * Amra aikhane error handle koreci sudho logig er. Amader code er bivinno condition er maddhome next(error) method ke call kore error handle kortesi. But jodi mongoose or zod er error hoi, sei error message gulo organize noi. Tai nicher aro kiso condition dia mongoose and zod er error gulo ke modify kora holo. Mongoose and zod er kiso common error holo:
   * 1. Mongoose Duplicate key error
   * 2. Mongoose Invalid MongoDB Object ID
   * 3. Mongoose Validation error --> kono property er type mismatch hole ba mongoose a dewa condition failed korle.
   *
   * 4. Zod Validation error --> Uporer ta mongoose theke asa type mismatch handle kore. But jodi zod theke airokom validation error ase. Tahole extra vabe handle korte hobe.
   *
   */

  // Cloudinary theke image delete korar kaj korbo. Jodi req.file ba req.files.length er value true hoi.
  // single image upload er por data create or update a kono error hole .
  if (req.file) {
    await deleteImageFromCloudinary(req.file.path);
  }

  // multiple image delete korar jonno
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const imagesUrl = req.files.map((file) => file.path);

    // aikhane Promise.all() method er moddhe loop chalia delete kora hoiase. Aikhane Promise.all() use na korlw hoto. but time besi lagto. Karon akta url asbe delete request korbe fully delete hobe, then arekta image er url asbe and delete er request korbe. Thats mean akta ses hower por arekta suro hobe. Ar Promise.all() use korar fole all url er jonno request aksathe hobe. And cloudinary te aksathe multiple image delete hote thakbe. Aktar por akta noi. Tai loading kom hoi.
    await Promise.all(imagesUrl.map((url) => deleteImageFromCloudinary(url)));
  }

  let statusCode = 500;
  let message = `Something went wrong`;
  let errorSources: TValidation[] = [
    // {
    //   path: "isVerified",
    //   message: "Cast to Boolean failed for value ..."
    // }
  ];

  // AppError class er moddhe jodi error object er property gulo thake, tahole statusCode and message variable er value change kore error.statusCode and error.message er value set kore dibo ba dynamic korbo.

  // amader project development a thaklei sudho ai console.log hose. Because production a ai console user dekhle issue hobe.
  if (envVars.NODE_ENV === "development") {
    console.log("Gobal error is ", error);
  }

  // Mongoose Duplicate key error
  if (error.code === 11000) {
    const simplifiedError = handleDuplicateKeyError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }

  // Mongoose Invalid MongoDB Object ID
  else if (error.name === "CastError") {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // Mongoose Validation error
  else if (error.name === "ValidationError") {
    const simplifiedError = handleMongooseValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as TValidation[];
  }
  // Zod Validation error
  else if (error.name === "ZodError") {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as TValidation[];
  }
  // Jokhon throw new AppError() ke call kori, tokhon ai block a jai.
  else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }
  // Jokhon throw new Error() ke call kori, tokhon ai block a jai.
  else if (error instanceof Error) {
    statusCode = 500;
    message = error.message;
  }

  res.status(statusCode).json({
    succuss: false,
    message,
    errorSources,
    error: envVars.NODE_ENV === "development" ? error : null,
    stack: envVars.NODE_ENV === "development" ? error.stack : null, // production a gele stack a null dekhabe. Tokhon error er details show hobena.
  });
};
