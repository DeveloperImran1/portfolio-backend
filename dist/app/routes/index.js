"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const blog_route_1 = require("../modules/blog/blog.route");
const comment_route_1 = require("../modules/comment/comment.route");
const otp_route_1 = require("../modules/otp/otp.route");
const reaction_route_1 = require("../modules/reaction/reaction.route");
const stats_route_1 = require("../modules/stats/stats.route");
const user_route_1 = require("../modules/user/user.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/user',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/otp',
        route: otp_route_1.OtpRoutes,
    },
    {
        path: '/stats',
        route: stats_route_1.StatsRoutes,
    },
    {
        path: '/blogs',
        route: blog_route_1.BlogRoutes,
    },
    {
        path: '/reaction',
        route: reaction_route_1.ReactionRoute,
    },
    {
        path: '/comment',
        route: comment_route_1.CommentRoute,
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
