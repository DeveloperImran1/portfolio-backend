"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const booking_model_1 = require("../booking/booking.model");
const payment_interface_1 = require("../payment/payment.interface");
const payment_model_1 = require("../payment/payment.model");
const tour_model_1 = require("../tour/tour.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7); // ajker date theke 7 din ager date ke get korbe.
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);
const getUserStats = () => __awaiter(void 0, void 0, void 0, function* () {
    // ai query gulote await use korini. Karon aisob gulo promise return korabo. And sobar last a await Promise.all([]) er moddhe aksathe promise gulo ke resolve korbo.
    const totalUsersPromise = user_model_1.User.countDocuments();
    const totalActiveUsesrPromise = user_model_1.User.countDocuments({
        isActive: user_interface_1.IsActive.ACTIVE,
    });
    const totalInActiveUsesrPromise = user_model_1.User.countDocuments({
        isActive: user_interface_1.IsActive.INACTIVE,
    });
    const totalBlockedUsesrPromise = user_model_1.User.countDocuments({
        isActive: user_interface_1.IsActive.BLOCK,
    });
    const newUsersInLast7DaysPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: sevenDaysAgo }, // aikhane createdAt er value jeigulo sevenDaysAgo theke boro, seigulo get korbo. Karon din joto jasse, total milisecond toto besi hosse.
    });
    const newUsersInLast30DaysPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
    });
    const usersByRolePromise = user_model_1.User.aggregate([
        // Stage 1: grouping by user role and count total users in eacy role
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 },
            },
        },
    ]);
    const [totalUsers, totalActiveUsesrs, totalInActiveUsesrs, totalBlockedUsesrs, newUsersInLast7Days, newUsersInLast30Days, usersByRole,] = yield Promise.all([
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
});
const getTourStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalTourPromise = yield tour_model_1.Tour.countDocuments().lean(); // last a .lean() use korle aro better hoi.
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
    const totalTourByTourTypePromise = tour_model_1.Tour.aggregate([
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
    const totalTourByTourDivisionPromise = tour_model_1.Tour.aggregate([
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
    const avgTourCostPromise = tour_model_1.Tour.aggregate([
        // stage 1: group the cost from, do the sum, and average the sum
        {
            $group: {
                _id: null,
                avgCostFrom: { $avg: "$costFrom" },
            },
        },
    ]);
    const totalHighestBookedTourPromise = booking_model_1.Booking.aggregate([
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
    const [totalTour, totalTourByTourType, totalTourByTourDivision, avgTourCost, totalHighestBookedTour,] = yield Promise.all([
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
});
const getBookingStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalBookingPromise = booking_model_1.Booking.countDocuments();
    const totalBookingByStatusPromise = booking_model_1.Booking.aggregate([
        //stage-1 group stage
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);
    const bookingsPerTourPromise = booking_model_1.Booking.aggregate([
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
    const avgGuestCountPerBookingPromise = booking_model_1.Booking.aggregate([
        // stage 1  - group stage
        {
            $group: {
                _id: null,
                avgGuestCount: { $avg: "$guestCount" },
            },
        },
    ]);
    const bookingsLast7DaysPromise = booking_model_1.Booking.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
    });
    const bookingsLast30DaysPromise = booking_model_1.Booking.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
    });
    const totalBookingByUniqueUsersPromise = booking_model_1.Booking.distinct("user").then((user) => user.length);
    const [totalBooking, totalBookingByStatus, bookingsPerTour, avgGuestCountPerBooking, bookingsLast7Days, bookingsLast30Days, totalBookingByUniqueUsers,] = yield Promise.all([
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
});
const getPaymentStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalPaymentPromise = payment_model_1.Payment.countDocuments();
    const totalPaymentByStatusPromise = payment_model_1.Payment.aggregate([
        //stage 1 group
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);
    const totalRevenuePromise = payment_model_1.Payment.aggregate([
        //stage1 match stage
        {
            $match: { status: payment_interface_1.PAYMENT_STATUS.PAID },
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$amount" },
            },
        },
    ]);
    const avgPaymentAmountPromise = payment_model_1.Payment.aggregate([
        //stage 1 group stage
        {
            $group: {
                _id: null,
                avgPaymentAMount: { $avg: "$amount" },
            },
        },
    ]);
    const paymentGatewayDataPromise = payment_model_1.Payment.aggregate([
        //stage 1 group stage
        {
            $group: {
                _id: { $ifNull: ["$paymentGatewayData.status", "UNKNOWN"] },
                count: { $sum: 1 },
            },
        },
    ]);
    const [totalPayment, totalPaymentByStatus, totalRevenue, avgPaymentAmount, paymentGatewayData,] = yield Promise.all([
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
});
exports.StatsServices = {
    getBookingStats,
    getPaymentStats,
    getUserStats,
    getTourStats,
};
