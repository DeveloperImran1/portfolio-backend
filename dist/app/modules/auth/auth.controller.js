"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Ai auth module er moddhe authenticaiton: login, logout, password reset etc kaj korbo. Aitar jonno extra vabe interface, model or schema create korte hobena. Ai schema, interface user model, interface dia hoia jabe.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const passport_1 = __importDefault(require("passport"));
const env_1 = require("../../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const setCookie_1 = require("../../utils/setCookie");
const userTokens_1 = require("../../utils/userTokens");
const auth_service_1 = require("./auth.service");
const credentialsLogin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // AuthServices.credentialsLogin function er kajta nicher passport.ts file er maddhome kora hoiase. Tai ai line comment koresi.
    // const loginInfo = await AuthServices.credentialsLogin(req.body);
    //credentialsLogin er maddhe jaja kortam, ta akhon passport.authentecation er moddhe korbo.
    passport_1.default.authenticate("local", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            // ❌❌❌❌ aivaime error throw kora jabena.
            // throw new AppError(402, "Something went wrong")
            // return new AppError(401, err);
            // next(err)
            // ✅✅✅✅ aivabe error ke return korte hobe passport er moddhe theke
            // return next(err);
            return next(new AppError_1.default(401, err));
        }
        if (!user) {
            return next(new AppError_1.default(401, info.message));
        }
        // user thakle user er info dia token create
        const userTokens = (0, userTokens_1.createUserTokens)(user);
        // cookie te set kortesi
        (0, setCookie_1.setAuthCookie)(res, userTokens);
        // user theke password ke remove kortesi
        const _a = user.toObject(), { password } = _a, rest = __rest(_a, ["password"]);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "User loged in successfull!",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest,
            },
        });
    }))(req, res, next); // credentials login aikhane middleware hisabe kaj kortese. but passport.authenticate() oi middleware er moddhe thaka arekti function. So aitake amader call korte hobe. Tasara hobena.
}));
const getNewAccessToken = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // amra jokhon login korbo, tokhon refresh token ta client side er browser er cookie te set kore rakhbe. Akhon new Access token generate korar somoi sei refresh token lagbe. Seita amra req.cookies.refreshToken theke nita parbo.
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "No refresh token recived from cookies");
    }
    const tokenInfo = yield auth_service_1.AuthServices.getNewAccessToken(refreshToken);
    // refresh token er moaddhome jokhon new token create korteci, tokhon sei token ta responce hisabe client side a pathassi. But cookie te new access-token ta set kore dita hobe. Tai aikhane res send korar age updated token ta cookie te set kore disi.
    (0, setCookie_1.setAuthCookie)(res, tokenInfo);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "New Access Token Retrived Successfully",
        data: tokenInfo,
    });
}));
const logout = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Kono user Login ase kina seita ensure hote pari, browser er cookie te accessToken and refreshToken ase kina. Seita check kori. So logout korar jonno accessToken and refreshToken remove korte parle kella fote.
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Logged Out Successfully",
        data: null,
    });
}));
const resetPassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    yield auth_service_1.AuthServices.resetPassword(req.body, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Password Reset Successfully",
        data: null,
    });
}));
const setPassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const { password } = req.body;
    yield auth_service_1.AuthServices.setPassword(decodedToken.userId, password);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Password set Successfully",
        data: null,
    });
}));
const forgotPassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    yield auth_service_1.AuthServices.forgotPassword(email);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Email Send Successfully",
        data: null,
    });
}));
const changePassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // auth.controller a asar age checkAuth middleware a giasilo. Then next() er maddhome ai controller a asce. So checkAuth er moddhe token ke docode kore user er info gulo req.user property er moddhe set kore diase. Tai aikhane distructure kore nissi.
    const decodedToken = req.user;
    const newPassword = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.newPassword;
    const oldPassword = (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.oldPassword;
    if (!newPassword || !oldPassword) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Old password and new password field is required");
    }
    yield auth_service_1.AuthServices.resetPassword(req.body, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Password Reset Successfully",
        data: null,
    });
}));
const googleCallbackcontroller = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // amra credential dia login korar somoi, req.user er moddhe user er data gulo set kore ditam. But config > passport.ts file a passport er maddhome login korai. Passport ai req.user namer akta propety er moddhe user er value set kore dei automatically.
    const user = req.user;
    // google dia login korar korar somoi route a state namer akta property er moddhe redirect path te set koreci, jar fole aikhane query theke state name a value ta pabo.
    let redirectTo = req.query.state ? req.query.state : "";
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1);
    }
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    // user thakle user er moddhe email, name, _id, role etc. ase. Oi user er value dia createUserTokens() function accessToken and refreshToken create kore diba.
    const tokenInfo = (0, userTokens_1.createUserTokens)(user);
    // token create kora done, akhon ai token gulo cookie te set kore diba setAuthCookie function.
    (0, setCookie_1.setAuthCookie)(res, tokenInfo);
    // sendResponse(res, {
    //   success: true,
    //   statusCode: httpStatus.OK,
    //   message: "Password Reset Successfully",
    //   data: null,
    // });
    // login hower pore front-end a res send korte hobena. redirect kore dilai hobe. Akhon redirectTo er value thakle user er exptectation route a redirect korbe. ar redirectTo empty string hole home page a redirect korbe.
    res.redirect(`${env_1.envVars.FRONTEND_URL}/${redirectTo}`);
}));
exports.AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    setPassword,
    changePassword,
    googleCallbackcontroller,
    forgotPassword,
};
