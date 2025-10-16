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
const user_model_1 = require("../user/user.model");
const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7); // ajker date theke 7 din ager date ke get korbe.
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);
const getUserStats = () => __awaiter(void 0, void 0, void 0, function* () {
    // ai query gulote await use korini. Karon aisob gulo promise return korabo. And sobar last a await Promise.all([]) er moddhe aksathe promise gulo ke resolve korbo.
    const totalUsersPromise = user_model_1.User.countDocuments();
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
                _id: '$role',
                count: { $sum: 1 },
            },
        },
    ]);
    const [totalUsers, totalActiveUsesrs, totalInActiveUsesrs, totalBlockedUsesrs,] = yield Promise.all([
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
});
exports.StatsServices = {
    getUserStats,
};
