import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';
import { StatsController } from './stats.controller';

const router = Router();

router.get('/user', checkAuth(Role.ADMIN), StatsController.getUserStats);

export const StatsRoutes = router;
