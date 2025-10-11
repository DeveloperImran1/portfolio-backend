import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { Role } from '../user/user.interface';
import { ReactionController } from './reaction.controller';
import { createReactionZodSchema } from './reaction.validation';

const router = Router();

router.post(
  '/create',
  checkAuth(Role.ADMIN, Role.USER),
  validateRequest(createReactionZodSchema),
  ReactionController.createReaction,
);

router.get('/:blogId', ReactionController.allReactionWithBlogId);

export const ReactionRoute = router;
