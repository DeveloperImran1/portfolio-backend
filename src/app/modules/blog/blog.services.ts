import httpStatus from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { deleteImageFromCloudinary } from '../../../config/cloudinary.config';
import AppError from '../../errorHelpers/AppError';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { User } from '../user/user.model';
import { blogSearchableFields } from './blog.constant';
import { IBlog } from './blog.interface';
import { Blog } from './blog.model';

const createBlog = async (paylaod: IBlog, decodedToken: JwtPayload) => {
  const user = await User.findById(decodedToken.userId);
  const blogData = {
    ...paylaod,
    authorId: user?._id,
    authorPhoto: user?.picture,
  };

  const blog = await Blog.create(blogData);
  return blog;
};

const updateBlog = async (blogId: string, payload: Partial<IBlog>) => {
  // ai condition check na korleo hobe. Because zod schemate slug ke remove koresi. Thts mean front-end theke slug field aslew, zod schemar maddhome slug field remove hoia aikhane asbe.
  if (payload.slug) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You cannot modify slug');
  }

  if (payload.views || payload.reactionsCount || payload.commentCount) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You donot modify this field');
  }

  const isBlogExist = await Blog.findById(blogId);

  if (!isBlogExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This blog not exist');
  }

  //
  if (payload.title && !payload.slug) {
    payload.slug = payload.title.toLowerCase().replace(/\s+/g, '-');
  }

  if (payload.content) {
    const words = payload.content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 50);
    payload.readTime = `${minutes} min read`;
  }

  const newUpdateBlog = await Blog.findByIdAndUpdate(blogId, payload, {
    new: true,
    runValidators: true,
  });

  // division update hower pore previous image ke delete korte hobe.
  if (payload.thumbnail && isBlogExist.thumbnail) {
    await deleteImageFromCloudinary(isBlogExist.thumbnail);
  }

  return newUpdateBlog;
};

const deleteBlog = async (blogId: string) => {
  const isBlogExist = await Blog.findById(blogId);

  if (!isBlogExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This blog not exist');
  }

  const deleteBlog = await Blog.findByIdAndDelete(blogId);

  return deleteBlog;
};

const getAllBlog = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Blog.find(), query);
  const division = await queryBuilder
    .search(blogSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    division.build(),
    queryBuilder.getMeta(),
  ]);
  return {
    meta,
    data,
  };
};

const getSingleBlog = async (slug: string) => {
  const blog = await Blog.findOne({ slug });

  return {
    data: blog,
  };
};

const getAllFeaturedBlog = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Blog.find(), query);
  const division = await queryBuilder
    .search(blogSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    division.build(),
    queryBuilder.getMeta(),
  ]);
  return {
    meta,
    data,
  };
};

export const BlogServices = {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlog,
  getSingleBlog,
  getAllFeaturedBlog,
};
