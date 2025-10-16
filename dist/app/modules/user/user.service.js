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
exports.UserServices = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const user_constant_1 = require("./user.constant");
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
// Aikhane Partial<IUser> dara bujasse, Iuser interface er type gulote jei property ase, exact all property na thake similar kiso property thakbe.
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User already exist");
    }
    const authProvider = {
        provider: "credentials",
        providerId: email,
    };
    const hashPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const user = yield user_model_1.User.create(Object.assign({ email, password: hashPassword, auths: authProvider }, rest));
    return user;
});
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * email --> cannot update
     * user can update :  password, name etc.
     * password --> for update need rehashing
     * Only admin can update isBlock, role
     */
    // Admin and admin je karo info update korte pare. But jodi role user hoi tahole se sudho nijer profile update korte parbe. Onno karo profile change korte parbena.
    if (decodedToken.role == user_interface_1.Role.USER) {
        if (userId !== decodedToken.userId) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    // user exist naki, check korbo
    const isUserExist = yield user_model_1.User.findById(userId);
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not exist");
    }
    // payload er moddhe role property thakle vitore dhukbe.
    if (payload.role) {
        // decodedToken or request kora user er role jodi user hoi. Tahole role ke update korte parbena.
        if (decodedToken.role === user_interface_1.Role.USER) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
        // decodedToken or request kora user er role jodi admin hoi. Tahole superAdmin er kono kiso update korte parbena sei admin. Tai check kortesi payload a asa role er value ki superAdmin naki.
        if (decodedToken.role === user_interface_1.Role.USER && payload.role === user_interface_1.Role.ADMIN) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    // isActive, isDeleted, isVerified property gulo sudho admin or super admin update korte parbe.
    if (payload.isBlock) {
        if (decodedToken.role === user_interface_1.Role.USER) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    const newUpdatedUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true, // update hoia updated info gulo newUpdatedUser er moddhe asbe.
        runValidators: true, // runValidators er maddhome mongoose er schema check kore update hobe. Ai property true na korle mongoose er schema check na kore set hoia jabe.
    });
    return newUpdatedUser;
});
const getAllUser = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(user_model_1.User.find(), query);
    const users = yield queryBuilder
        .search(user_constant_1.userSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        users.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        meta,
        data,
    };
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // find korar por .select("-password") --> dara bujhai password field ta bade all field get hobe. Ar minus symboll na dila, sudho password field tai get hoto.
    const user = yield user_model_1.User.findById(id).select("-password");
    return {
        data: user,
    };
});
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select("-password");
    return {
        data: user,
    };
});
exports.UserServices = {
    createUser,
    getAllUser,
    updateUser,
    getSingleUser,
    getMe,
};
