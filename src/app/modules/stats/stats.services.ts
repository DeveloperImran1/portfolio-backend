/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '../user/user.model';

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7); // ajker date theke 7 din ager date ke get korbe.
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

const getUserStats = async () => {
  // ai query gulote await use korini. Karon aisob gulo promise return korabo. And sobar last a await Promise.all([]) er moddhe aksathe promise gulo ke resolve korbo.
  const totalUsersPromise = User.countDocuments();

  const newUsersInLast7DaysPromise = User.countDocuments({
    createdAt: { $gte: sevenDaysAgo }, // aikhane createdAt er value jeigulo sevenDaysAgo theke boro, seigulo get korbo. Karon din joto jasse, total milisecond toto besi hosse.
  });

  const newUsersInLast30DaysPromise = User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  const usersByRolePromise = User.aggregate([
    // Stage 1: grouping by user role and count total users in eacy role
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    totalUsers,
    totalActiveUsesrs,
    totalInActiveUsesrs,
    totalBlockedUsesrs,
  ] = await Promise.all([
    totalUsersPromise,
    newUsersInLast7DaysPromise,
    newUsersInLast30DaysPromise,
    usersByRolePromise,
  ]);

  return {
    totalUsers,
    totalActiveUsesrs,
    totalInActiveUsesrs,
    totalBlockedUsesrs,
  };
};

export const StatsServices = {
  getUserStats,
};
