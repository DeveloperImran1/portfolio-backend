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
exports.OTPServices = void 0;
const crypto_1 = __importDefault(require("crypto"));
const redis_config_1 = require("../../../config/redis.config");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const sendEmail_1 = require("../../utils/sendEmail");
const user_model_1 = require("../user/user.model");
const OTP_EXPIRATION = 2 * 60; // 120 s
const generateOTP = (length = 6) => {
    // 6 digit er otp create --> crypto ke import korte hobe. Aita js er bult in method. cryptke use kore randomByte, randomUUId, random string er moto aro onek kisoi create kora jai. aikhane crypto.randomInt(startNum, endNumber) nei. and tar moddhe number generate kore di. Aikhane startNumber=100000 diasi. Mane 6 digit er number diasi. Ar endNumber ta 7 digit er diasi. But tar ager number porjonto niba. Thats mean 999999 porjonto count korbe. Tahole 6 digit er akta otp generate kora possible hobe.
    //   const otp = crypto.randomInt(100000, 1000000);  // 100000 - 999999 porjonto count korbe.
    // Ai number dewar poart ke dynamic korbo. Because otp er length kom besi hote pare.
    const otp = crypto_1.default.randomInt(10 ** (length - 1), 10 ** length).toString(); // length 6 hole value er moddhe hobe: 100000 - 999999
    return otp;
};
const sendOTP = (email, name) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(401, "User Not Found");
    }
    if (user.isVerified) {
        throw new AppError_1.default(401, "User Already verified");
    }
    const otp = generateOTP();
    const redisKey = `otp:${email}`;
    yield redis_config_1.redisClient.set(redisKey, otp, {
        expiration: {
            type: "EX",
            value: OTP_EXPIRATION, // expiration time second a dita hobe. Karon type: EX dara second bujhai. type er value milisecond ba minute ew set kora jai.
        },
    });
    // sendEmail er maddhome oi otp ta user ke send kora hosse. Aita amra redis websit a DB te create koresi, oikhane connect a click korle "Launch Redis Insight Web" button a click korle akta page open hobe. Seikhane otp ta store thakbe expiration time 2 minute porjonto. Tarpor delete hoia jabe.
    yield (0, sendEmail_1.sendEmail)({
        to: email,
        subject: "Your OTP Code",
        templateName: "otp",
        templateData: {
            name,
            otp,
        },
    });
    return {};
});
const verifyOTP = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(401, "User Not Found");
    }
    if (user.isVerified) {
        throw new AppError_1.default(401, "User Already verified");
    }
    const redisKey = `otp:${email}`;
    // redis DB te find kortesi, ai key dia otp ase kina. Thakle get korbe. Aita localstorage er key value er moto kaj kore.
    const savedOTP = yield redis_config_1.redisClient.get(redisKey);
    if (!savedOTP) {
        throw new AppError_1.default(401, "Invalid OTP");
    }
    if (savedOTP !== otp) {
        throw new AppError_1.default(401, "Invalid OTP");
    }
    // aikhane update korar kaj and redis theke otp delete korar kaj ta ake oporer sathe dependent. Tai rollback er maddhome korte hoto. Or aivabe Promis.all([er moddhe korleww hobe.])
    yield Promise.all([
        user_model_1.User.updateOne({ email: email }, { isVerified: true }, { runValidators: true }),
        redis_config_1.redisClient.del([redisKey]), // otp match kore update er kaj ses hole redis DB theke delete kore dibo. Otherwise 2 minute pore oo delete hobe.
    ]);
});
exports.OTPServices = { sendOTP, verifyOTP };
