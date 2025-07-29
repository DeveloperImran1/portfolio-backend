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
exports.UserControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const user_service_1 = require("./user.service");
// // controller er moddhe amra sudho user theke request nibo, client side theke data gulo accept korbo and finaly responce send korbo. Ar query or buisness logic likha DB er sathe communicate korar kaj gulo user.service.ts file a korbo.
// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     // throw new Error("false error!!");
//     // age error throw korle sudho message dita partam perameter a. But errorHelpers > AppError.ts file a AppError namer akta class declare koreci. Jei class Error er all property nia ase and tar sathe statusCode namer akta property set kore. Jeita amra throw new Error() ke call na kore. Akhon AppError ke call korbo. Jar fole statusCode and errorMessage 2tai send korte parbo.
//     // throw new AppError(httpStatus.BAD_REQUEST, "Fake error");
//     const user = await UserServices.createUser(req.body);
//     res.status(httpStatus.CREATED).json({
//       success: true,
//       message: "User created",
//       user,
//     });
//   } catch (error: any) {
//     next(error);
//   }
// };
// ------------> Upore amra normaly try-catch and userServices use kore api create koreci. But akhon repetitive kaj gulo ke akta function er maddhome handle korbo:
const createUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.UserServices.createUser(req.body);
    // age amra aivabe every api theke result ke send kortesilam. But sei kajta akhon sendResponse.ts utils er maddhome aro easily korbo.
    // res.status(httpStatus.CREATED).json({
    //   success: true,
    //   message: "User created",
    //   user,
    // });
    // sendResponse utils using res send
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User created Successfully",
        data: user,
    });
}));
const updateUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const payload = req.body;
    // const token = req.headers.authorization as string;
    // const verifiedToken = verifyToken(
    //   token,
    //   envVars.JWT_ACCESS_SECRET
    // ) as JwtPayload;
    // checkAuth.ts file a verifiedToken token ke req.user property er moddhe set koresi. Jar fole uporer moto kore abar verify na kore req.user theke nita partesi.
    const verifiedToken = req.user;
    const user = yield user_service_1.UserServices.updateUser(userId, payload, verifiedToken);
    // sendResponse utils using res send
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User Updated Successfully",
        data: user,
    });
}));
// get all users
const getAllUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield user_service_1.UserServices.getAllUser(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User retrived Successfully",
        data,
    });
}));
const getSingleUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const user = yield user_service_1.UserServices.getSingleUser(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User retrived successfully",
        data: user,
    });
}));
const getMe = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const user = yield user_service_1.UserServices.getMe(decodedToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User retrived successfully",
        data: user,
    });
}));
exports.UserControllers = {
    createUser,
    getAllUser,
    updateUser,
    getSingleUser,
    getMe,
};
