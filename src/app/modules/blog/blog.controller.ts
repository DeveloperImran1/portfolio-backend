/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { BlogServices } from './blog.services';

const createBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // jeheto req.file.path er moddhe upload kora imageer link pawa jabe. Tai oi image ta ke thumbnail property er moddhe set kore dibo.
    const paylaod = { ...req.body, thumbnail: req.file?.path };
    const decodedToken = req.user as JwtPayload;

    const blog = await BlogServices.createBlog(paylaod, decodedToken);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: 'Blog created successfully',
      data: { blog },
    });
  },
);

const updateBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const blogId = req.params.id;

    let payload;
    if (req?.file?.path) {
      payload = { ...req.body, thumbnail: req.file?.path };
    } else {
      payload = req.body;
    }
    const updatedBlog = await BlogServices.updateBlog(blogId, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Blog updated successfully',
      data: updateBlog,
    });
  },
);

const deleteBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const blogId = req.params.id;

    const deleteBlog = await BlogServices.deleteBlog(blogId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Blog deleted successfully',
      data: deleteBlog,
    });
  },
);

const getAllBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const blog = await BlogServices.getAllBlog(
      req.query as Record<string, string>,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Blog retrived successfully',
      data: blog,
    });
  },
);

const getSingleBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const blog = await BlogServices.getSingleBlog(slug);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Blog retrived successfully',
      data: blog,
    });
  },
);
export const BlogController = {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlog,
  getSingleBlog,
};
