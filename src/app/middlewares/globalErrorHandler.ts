import { NextFunction, Request, Response } from "express";
import { envVars } from "../../config/env";
import AppError from "../errorHelpers/AppError";

// globalErrorHandler ke middleware er moddhe create koresi and app.ts file a app.use(globalErrorHanlder) koreci. Jar fole every api er last a catch block theke next(error) ke call korle ai globalErrorHandler function ta exicute hobe. So every api a ar extra vabe error handle korte hobena.
export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = `Something went wrong`;

  // AppError class er moddhe jodi error object er property gulo thake, tahole statusCode and message variable er value change kore error.statusCode and error.message er value set kore dibo ba dynamic korbo.
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Error) {
    statusCode = 500;
    message = error.message;
  }
  res.status(statusCode).json({
    succuss: false,
    message,
    error,
    stack: envVars.NODE_ENV === "development" ? error.stack : null, // production a gele stack a null dekhabe. Tokhon error er details show hobena.
  });
};
