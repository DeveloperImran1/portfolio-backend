import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";

// controller er moddhe amra sudho user theke request nibo, client side theke data gulo accept korbo and finaly responce send korbo. Ar query or buisness logic likha DB er sathe communicate korar kaj gulo user.service.ts file a korbo.
const createUser = async (req: Request, res: Response) => {
  try {
    const user = await UserServices.createUser(req.body);
    res.status(httpStatus.CREATED).json({
      success: true,
      message: "User created",
      user,
    });
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).json({
      message: error.message,
      error,
    });
  }
};

export const UserControllers = {
  createUser,
};
