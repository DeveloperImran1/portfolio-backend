import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { BlogRoutes } from '../modules/blog/blog.route';
import { BookingRoutes } from '../modules/booking/booking.route';
import { CommentRoute } from '../modules/comment/comment.route';
import { DivisionRoutes } from '../modules/division/division.route';
import { OtpRoutes } from '../modules/otp/otp.route';
import { PaymentRoutes } from '../modules/payment/payment.route';
import { ReactionRoute } from '../modules/reaction/reaction.route';
import { StatsRoutes } from '../modules/stats/stats.route';
import { TourRoutes } from '../modules/tour/tour.route';
import { TourTypeRoutes } from '../modules/tourType/tourType.route';
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
    path: '/division',
    route: DivisionRoutes,
  },
  {
    path: '/tour',
    route: TourTypeRoutes,
  },
  {
    path: '/tour',
    route: TourRoutes,
  },
  {
    path: '/booking',
    route: BookingRoutes,
  },
  {
    path: '/payment',
    route: PaymentRoutes,
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
