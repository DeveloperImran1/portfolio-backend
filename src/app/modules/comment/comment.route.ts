import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { Role } from '../user/user.interface';
import { CommentController } from './comment.controller';
import {
  createCommentZodSchema,
  updateCommentZodSchema,
} from './comment.validation';

const router = Router();

router.post(
  '/create',
  checkAuth(Role.ADMIN, Role.USER),
  validateRequest(createCommentZodSchema),
  CommentController.createComment,
);
router.get('/:blogId', CommentController.allCommentWithBlogId);

router.patch(
  '/update/:id',
  checkAuth(Role.ADMIN, Role.USER),
  validateRequest(updateCommentZodSchema),
  CommentController.updatedComment,
);
router.delete(
  '/delete/:id',
  checkAuth(Role.ADMIN, Role.USER),
  CommentController.deleteComment,
);

export const CommentRoute = router;
