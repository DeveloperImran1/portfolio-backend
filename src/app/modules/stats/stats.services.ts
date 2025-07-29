/* eslint-disable @typescript-eslint/no-explicit-any */
import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { Tour } from "../tour/tour.model";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7); // ajker date theke 7 din ager date ke get korbe.
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

const getUserStats = async () => {
  // ai query gulote await use korini. Karon aisob gulo promise return korabo. And sobar last a await Promise.all([]) er moddhe aksathe promise gulo ke resolve korbo.
  const totalUsersPromise = User.countDocuments();

  const totalActiveUsesrPromise = User.countDocuments({
    isActive: IsActive.ACTIVE,
  });
  const totalInActiveUsesrPromise = User.countDocuments({
    isActive: IsActive.INACTIVE,
  });
  const totalBlockedUsesrPromise = User.countDocuments({
    isActive: IsActive.BLOCK,
  });

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
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    totalUsers,
    totalActiveUsesrs,
    totalInActiveUsesrs,
    totalBlockedUsesrs,
    newUsersInLast7Days,
    newUsersInLast30Days,
    usersByRole,
  ] = await Promise.all([
    totalUsersPromise,
    totalActiveUsesrPromise,
    totalInActiveUsesrPromise,
    totalBlockedUsesrPromise,
    newUsersInLast7DaysPromise,
    newUsersInLast30DaysPromise,
    usersByRolePromise,
  ]);

  return {
    totalUsers,
    totalActiveUsesrs,
    totalInActiveUsesrs,
    totalBlockedUsesrs,
    newUsersInLast7Days,
    newUsersInLast30Days,
    usersByRole,
  };
};

const getTourStats = async () => {
  const totalTourPromise = await Tour.countDocuments().lean(); // last a .lean() use korle aro better hoi.

  // Amra jokhon manualy DB te data isert kore dei compas theke. Tokhon objectId hisabe na bose, sobgulo string hoia thake. Tai aikhane update koresi tader ke, jei typeType and division property er type string. Taderke type toObjectId set kore diasi.
  //   await Tour.updateMany(
  //     {
  //       // Only update koro where tourType and division is stored as string
  //       $or: [
  //         { tourType: { $type: "string" } },
  //         { division: { $type: "string" } },
  //       ],
  //     },
  //     [
  //       {
  //         $set: {
  //           tourType: { $toObjectId: "$tourType" },
  //           division: { $toObjectId: "$division" },
  //         },
  //       },
  //     ]
  //   );

  const totalTourByTourTypePromise = Tour.aggregate([
    // stage 1: connect tour type model using lookup stage
    {
      $lookup: {
        from: "tourtypes", // Model name aita: TourType  --> aikhane collection name dita hobe. Karon collection name a sobgulo lowercase hoia jabe and plural name hobe. So last akta s add hobe. Better option holo MondoDB Compas theke collection name ta dekhe aikhane bosate hobe. [Note: from er moddhe sei model er name thakbe, jei collection ke Tour.aggregate --> a Tour collection er sathe addk orte chassi.]
        localField: "tourType", // ai localField er value ta hobe Upore jei collection ke aggregate kortesi, sei collection er kono akta field.
        foreignField: "_id",
        as: "type",
      },
    },

    // stage 2: unwind the array to object
    {
      $unwind: "$type",
    },
    // stage 3: grouping the tour type
    {
      $group: {
        _id: "$type.name",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalTourByTourDivisionPromise = Tour.aggregate([
    // stage 1: connect division model using lookup stage
    {
      $lookup: {
        from: "divisions",
        localField: "division",
        foreignField: "_id",
        as: "division",
      },
    },

    // stage 2: unwind the array to object
    {
      $unwind: "$division",
    },
    // stage 3: grouping the division
    {
      $group: {
        _id: "$division.name",
        count: { $sum: 1 },
      },
    },
  ]);

  const avgTourCostPromise = Tour.aggregate([
    // stage 1: group the cost from, do the sum, and average the sum
    {
      $group: {
        _id: null,
        avgCostFrom: { $avg: "$costFrom" },
      },
    },
  ]);

  const totalHighestBookedTourPromise = Booking.aggregate([
    // stage 1: group the tour
    {
      $group: {
        _id: "$tour",
        bookingCount: { $sum: 1 },
      },
    },
    // stage 2: sort the tour
    {
      $sort: { bookingCount: -1 },
    },
    // stage 3: linit tour
    {
      $limit: 5,
    },
    // stage 4: lookup stage
    {
      $lookup: {
        from: "tours",
        let: { tourId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$tourId"] },
            },
          },
        ],
        as: "tour",
      },
    },
    // stage 5: unsing tour
    {
      $unwind: "$tour",
    },
    // stage 6: project property
    {
      $project: {
        bookingCount: 1,
        "tour.title": 1,
        "tour.slug": 1,
      },
    },
  ]);

  const [
    totalTour,
    totalTourByTourType,
    totalTourByTourDivision,
    avgTourCost,
    totalHighestBookedTour,
  ] = await Promise.all([
    totalTourPromise,
    totalTourByTourTypePromise,
    totalTourByTourDivisionPromise,
    avgTourCostPromise,
    totalHighestBookedTourPromise,
  ]);
  return {
    totalTour,
    totalTourByTourType,
    totalTourByTourDivision,
    avgTourCost,
    totalHighestBookedTour,
  };
};

const getBookingStats = async () => {
  const totalBookingPromise = Booking.countDocuments();

  const totalBookingByStatusPromise = Booking.aggregate([
    //stage-1 group stage
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const bookingsPerTourPromise = Booking.aggregate([
    //stage1 group stage

    {
      $group: {
        _id: "$tour",
        bookingCount: { $sum: 1 },
      },
    },

    //stage-2 sort stage
    {
      $sort: { bookingCount: -1 },
    },

    //stage-3 limit stage
    {
      $limit: 10,
    },

    //stage-4 lookup stage
    {
      $lookup: {
        from: "tours",
        localField: "_id",
        foreignField: "_id",
        as: "tour",
      },
    },

    // stage5 - unwind stage
    {
      $unwind: "$tour",
    },

    // stage6 project stage

    {
      $project: {
        bookingCount: 1,
        _id: 1,
        "tour.title": 1,
        "tour.slug": 1,
      },
    },
  ]);

  const avgGuestCountPerBookingPromise = Booking.aggregate([
    // stage 1  - group stage
    {
      $group: {
        _id: null,
        avgGuestCount: { $avg: "$guestCount" },
      },
    },
  ]);

  const bookingsLast7DaysPromise = Booking.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });
  const bookingsLast30DaysPromise = Booking.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  const totalBookingByUniqueUsersPromise = Booking.distinct("user").then(
    (user: any) => user.length
  );

  const [
    totalBooking,
    totalBookingByStatus,
    bookingsPerTour,
    avgGuestCountPerBooking,
    bookingsLast7Days,
    bookingsLast30Days,
    totalBookingByUniqueUsers,
  ] = await Promise.all([
    totalBookingPromise,
    totalBookingByStatusPromise,
    bookingsPerTourPromise,
    avgGuestCountPerBookingPromise,
    bookingsLast7DaysPromise,
    bookingsLast30DaysPromise,
    totalBookingByStatusPromise,
    totalBookingByUniqueUsersPromise,
  ]);

  return {
    totalBooking,
    totalBookingByStatus,
    bookingsPerTour,
    avgGuestCountPerBooking: avgGuestCountPerBooking[0].avgGuestCount,
    bookingsLast7Days,
    bookingsLast30Days,
    totalBookingByUniqueUsers,
  };
};

const getPaymentStats = async () => {
  const totalPaymentPromise = Payment.countDocuments();

  const totalPaymentByStatusPromise = Payment.aggregate([
    //stage 1 group
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalRevenuePromise = Payment.aggregate([
    //stage1 match stage
    {
      $match: { status: PAYMENT_STATUS.PAID },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$amount" },
      },
    },
  ]);

  const avgPaymentAmountPromise = Payment.aggregate([
    //stage 1 group stage
    {
      $group: {
        _id: null,
        avgPaymentAMount: { $avg: "$amount" },
      },
    },
  ]);

  const paymentGatewayDataPromise = Payment.aggregate([
    //stage 1 group stage
    {
      $group: {
        _id: { $ifNull: ["$paymentGatewayData.status", "UNKNOWN"] },
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    totalPayment,
    totalPaymentByStatus,
    totalRevenue,
    avgPaymentAmount,
    paymentGatewayData,
  ] = await Promise.all([
    totalPaymentPromise,
    totalPaymentByStatusPromise,
    totalRevenuePromise,
    avgPaymentAmountPromise,
    paymentGatewayDataPromise,
  ]);
  return {
    totalPayment,
    totalPaymentByStatus,
    totalRevenue,
    avgPaymentAmount,
    paymentGatewayData,
  };
};

export const StatsServices = {
  getBookingStats,
  getPaymentStats,
  getUserStats,
  getTourStats,
};
