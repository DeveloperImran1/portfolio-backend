import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { User } from "./user.model";
const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const user = await User.create({ name, email });

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "User created",
      user,
    });
  } catch (error: any) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).json({
      message: error.message,
      error,
    });
  }
};

export const UserControllers = {
  createUser,
};
