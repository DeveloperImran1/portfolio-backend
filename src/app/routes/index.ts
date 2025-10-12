import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { BlogRoutes } from '../modules/blog/blog.route';
import { CommentRoute } from '../modules/comment/comment.route';
import { OtpRoutes } from '../modules/otp/otp.route';
import { ReactionRoute } from '../modules/reaction/reaction.route';
import { StatsRoutes } from '../modules/stats/stats.route';
import { UserRoutes } from '../modules/user/user.route';

export const router = Router();

const moduleRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },

  {
    path: '/otp',
    route: OtpRoutes,
  },
  {
    path: '/stats',
    route: StatsRoutes,
  },
  {
    path: '/blogs',
    route: BlogRoutes,
  },
  {
    path: '/reaction',
    route: ReactionRoute,
  },
  {
    path: '/comment',
    route: CommentRoute,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
