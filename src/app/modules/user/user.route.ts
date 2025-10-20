import { Router } from 'express';
import { multerUpload } from '../../../config/multer.config';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { UserControllers } from './user.controller';
import { Role } from './user.interface';
import { createUserZodSchema, updateUserZodSchema } from './user.validation';
const router = Router();

router.post(
  '/register',

  validateRequest(createUserZodSchema),
  UserControllers.createUser,
);

router.get('/all-users', checkAuth(Role.ADMIN), UserControllers.getAllUser);

// Jekono user ai router er maddhome tar nijer dota get korte parbe.
router.get('/me', checkAuth(...Object.values(Role)), UserControllers.getMe);

// akjon user ke onno user get korte parbena. sudho admin  get korte parbe.
router.get('/:id', checkAuth(Role.ADMIN), UserControllers.getSingleUser);

// api hobe: api/v1/user/:id
router.patch(
  '/:id',
  multerUpload.single('file'),
  checkAuth(...Object.values(Role)),
  validateRequest(updateUserZodSchema),
  UserControllers.updateUser,
);

export const UserRoutes = router;
