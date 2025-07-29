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
exports.BookingServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const getTransactionId_1 = require("../../utils/getTransactionId");
const payment_interface_1 = require("../payment/payment.interface");
const payment_model_1 = require("../payment/payment.model");
const sslCommerz_services_1 = require("../sslCommerz/sslCommerz.services");
const tour_model_1 = require("../tour/tour.model");
const user_model_1 = require("../user/user.model");
const booking_interface_1 = require("./booking.interface");
const booking_model_1 = require("./booking.model");
// Transaction Rollback: --> bolte bujhai ami amon akjon ke bkash a taka send kortesi, but sei user er bkash number nai. Tahole ami taka send korar pore sei taka jodi onno user er bkash a add na hoi kono karone. Tahole sei taka abar back hoia amar account a chole asbe. Ai process kei bole Transaction Rollback.
// Same case ta hosse aikhane, ami booking kortesi, jodi booking korar por payment a kono error hoi. tarpor booking ke update kortesi. But payment create korar somoi error khale seikhane theke return hoia chole jabe. Jar fole full api er kiso kaj holo and kiso kaj holona. Last operation ta missing thake gelo. Jeita howa jabena. Ai issue solve kora jai Transaction rollback er maddhome
/**
 * Transaction Rollback
 * duplicate DB/Virtual DB / Replica DB --> [Create Booking --> Create Payment (aikhane akta error hoisa) --> Update Booking ] --> Set Real DB/Main DB te.
 * Uporer process a dekhte pari Transaction rollback er maddhome operation gulo kora somoi duplicate ba vitrual akta DB create kore nei. And full operation gulo hoi sei virtual db te. Jodi akadhik operation er moddhe kono operation a error hoi. Tahole Sei virtual DB ta vanish ba remove hoia jai. Jemonta hoiase Create Payment korar por.  Ar jodi All statement ba operation successfully korto. Tahole ai duplicate Db ta main DB te ki replace hoia jato ba full api er kaj gulo korar fole changes ta main DB te set hoia jato. Full process ses na hower ag porjonto kono effect portona main db te.
 */
const createBooking = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        // api er all code aikhane likhte hobe.
        // [Note: Sudho create and update opration gulote 2nd perameter a {session} ke add korte hobe. Jodi create method hoi, tahole payload gulo akta array er moddhe dita hobe. ar return a akta array pawa jai. Jar 0 number index a operation er data ta thakbe. But  get operation (find, findById, findOne etc)   aigulote 2nd perameter a session ke add korte hobena. ]
        // --------------> start main code for this api
        const transactionId = (0, getTransactionId_1.getTransactionId)();
        const user = yield user_model_1.User.findById(userId);
        // user profile er moddhe phone and address na thakle, tader ke call or sms dewa issue hobe. Tai age profile update kore lagbe.
        if (!(user === null || user === void 0 ? void 0 : user.phone) || !(user === null || user === void 0 ? void 0 : user.address)) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Please update your profile to back a tour");
        }
        const tour = yield tour_model_1.Tour.findById(payload.tour).select("costFrom");
        // Jei tour book korbe, sei tour er moddhe costForm na thakle error throw korbe.
        if (!(tour === null || tour === void 0 ? void 0 : tour.costFrom)) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "No tour cost found");
        }
        const amount = Number(tour === null || tour === void 0 ? void 0 : tour.costFrom) * Number(payload.guestCount);
        // aikhane payload ta object akare akta aray er moddhe dewa hoisa. Ar end perameter a {session} set koresi. Return oo korbe akta array. Jar 0 number index a amader expected data thakbe.
        const booking = yield booking_model_1.Booking.create([
            Object.assign({ user: userId, status: booking_interface_1.BOOKING_STATUS.PENDING }, payload),
        ], { session });
        // Aikhanew same akta array er moddhe payload diasi. Karon aita create method. Jodi onno method hoto, tahole airokom array er moddhe payload dita hotona.
        const payment = yield payment_model_1.Payment.create([
            {
                booking: (_a = booking === null || booking === void 0 ? void 0 : booking[0]) === null || _a === void 0 ? void 0 : _a._id,
                status: payment_interface_1.PAYMENT_STATUS.UNPAID,
                transactionId: transactionId,
                amount: amount,
            },
        ], { session });
        const updatedBooking = yield booking_model_1.Booking.findByIdAndUpdate((_b = booking === null || booking === void 0 ? void 0 : booking[0]) === null || _b === void 0 ? void 0 : _b._id, { payment: (_c = payment === null || payment === void 0 ? void 0 : payment[0]) === null || _c === void 0 ? void 0 : _c._id }, { new: true, runValidators: true, session } // aikhane session ta add koresi.
        )
            .populate("user", "name email phone address") // booking update hoia booking er full data get hoto. But user property er moddhe jei reference id ase. Sei id er data get korar jonno populate use koresi. Ar end perameter a kon kon property ke sudho get korbo seita bole disi. select er kaj kortese 2nd perameter.
            .populate("tour", "title costFrom")
            .populate("payment");
        // Akhon payment korar function ke call korbo:
        const userName = (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).name;
        const userAddress = (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).address;
        const userEmail = (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).email;
        const userPhone = (updatedBooking === null || updatedBooking === void 0 ? void 0 : updatedBooking.user).phone;
        const sslPayload = {
            name: userName,
            email: userEmail,
            address: userAddress,
            phoneNumber: userPhone,
            amount: amount,
            transactionId: transactionId,
        };
        const sslPayment = yield sslCommerz_services_1.SSLServices.sslPaymentInit(sslPayload);
        // --------------> end main code for this api
        // sobar last a and return er age ai code gulo likhte hobe..
        yield session.commitTransaction(); // transaction --> jodi all operation right vabe hoi. tahole commitTransaction() hosse ba Virtual DB theke amader Main DB te set hobe.
        session.endSession(); // session ke end kore dita hobe.
        // amar api er operatioin sese result return korbo.
        return {
            paymentUrl: sslPayment === null || sslPayment === void 0 ? void 0 : sslPayment.GatewayPageURL,
            booking: updatedBooking,
        };
    }
    catch (error) {
        yield session.abortTransaction(); // rollback  --> Jodi upore try block er moddhe kono error hoi. Tahole abortTransaction() er maddhome virtual DB vanish hoia jabe. Main db te kisoi ses hobena.
        session.endSession();
        // throw new AppError(httpStatus.BAD_REQUEST, "Transaction rollback error")   // ai error use korbona. Because aita transaction rollback er error. ❌❌
        throw error;
    }
});
const getAllBookings = () => __awaiter(void 0, void 0, void 0, function* () {
    return {};
});
const getUserBookings = () => __awaiter(void 0, void 0, void 0, function* () {
    return {};
});
const getSingleBooking = () => __awaiter(void 0, void 0, void 0, function* () {
    return {};
});
const updateBookingStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    return {};
});
exports.BookingServices = {
    createBooking,
    getAllBookings,
    getUserBookings,
    getSingleBooking,
    updateBookingStatus,
};
