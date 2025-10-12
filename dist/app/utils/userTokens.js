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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewAccessTokenWithRefreshToken = exports.createUserTokens = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const user_model_1 = require("../modules/user/user.model");
const jwt_1 = require("./jwt");
const createUserTokens = (user) => {
    // Token create
    const jwtPayload = {
        email: user.email,
        role: user.role,
        userId: user._id,
    };
    const accessToken = (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.JWT_ACCESS_SECRET, env_1.envVars.JWT_ACCESS_EXPIRES);
    // Refresh token same way te create korbo, sudho secret and expires time ta change hobe.
    const refreshToken = (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.JWT_REFRESH_SECRET, env_1.envVars.JWT_REFRESH_EXPIRES);
    return { accessToken, refreshToken };
};
exports.createUserTokens = createUserTokens;
const createNewAccessTokenWithRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    // jei refreshToken dia new accessToken generate korbo, sei refreshToken valid kina ta verify korbo and decode kore user er data gulo nia asbo. Sei user er info gulo verifiedRefreshToken er moddhe store thakbe.
    const verifiedRefreshToken = (0, jwt_1.verifyToken)(refreshToken, env_1.envVars.JWT_REFRESH_SECRET);
    // DB te oi email er user ase kina, check kortesi.
    const isUserExist = yield user_model_1.User.findOne({ email: verifiedRefreshToken.email });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'User not found');
    }
    if (isUserExist.isBlock === true) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'User is blocked');
    }
    // accessToke token create kore return kore dissi. Akhon controller er moddhe ai new accessToken ta cookie te reset kore diba and front-end a send korbe.
    const jwtPayload = {
        email: verifiedRefreshToken.email,
        role: verifiedRefreshToken.role,
        userId: verifiedRefreshToken._id,
    };
    const accessToken = (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.JWT_ACCESS_SECRET, env_1.envVars.JWT_ACCESS_EXPIRES);
    return accessToken;
});
exports.createNewAccessTokenWithRefreshToken = createNewAccessTokenWithRefreshToken;
