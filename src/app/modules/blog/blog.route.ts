import { Router } from 'express';
import { multerUpload } from '../../../config/multer.config';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { Role } from '../user/user.interface';
import { BlogController } from './blog.controller';
import { createBlogZodSchema, updateBlogZodSchema } from './blog.validation';

const router = Router();

router.post(
  '/',
  checkAuth(Role.ADMIN),
  multerUpload.single('file'),
  validateRequest(createBlogZodSchema),
  BlogController.createBlog,
);

router.patch(
  '/:id',
  checkAuth(Role.ADMIN),
  multerUpload.single('file'),
  validateRequest(updateBlogZodSchema),
  BlogController.updateBlog,
);

router.delete('/:id', checkAuth(Role.ADMIN), BlogController.deleteBlog);

router.get('/', checkAuth(...Object.values(Role)), BlogController.getAllBlog);

router.get(
  '/:slug',
  checkAuth(...Object.values(Role)),
  BlogController.getSingleBlog,
);

export const BlogRoutes = router;
