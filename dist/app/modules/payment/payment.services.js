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
exports.PaymentServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const cloudinary_config_1 = require("../../../config/cloudinary.config");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const invoice_1 = require("../../utils/invoice");
const sendEmail_1 = require("../../utils/sendEmail");
const booking_interface_1 = require("../booking/booking.interface");
const booking_model_1 = require("../booking/booking.model");
const sslCommerz_services_1 = require("../sslCommerz/sslCommerz.services");
const payment_interface_1 = require("./payment.interface");
const payment_model_1 = require("./payment.model");
const successPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        // --------------> start main code for this api
        // Update Booking Status to COnfirm
        // Update Payment Status to PAID
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query === null || query === void 0 ? void 0 : query.transactionId }, { status: payment_interface_1.PAYMENT_STATUS.PAID }, { new: true, runValidators: true, session });
        // ai condition na dilaw hoto. But nicher invoiceData er property type error resolve korar korar jonno condtion diasi.
        if (!updatedPayment) {
            throw new AppError_1.default(401, "Payment update failed");
        }
        const updateBooking = yield booking_model_1.Booking.findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.booking, { status: booking_interface_1.BOOKING_STATUS.COMPLETE }, { new: true, runValidators: true, session } // aikhane session ta add koresi.
        )
            .populate("tour", "title")
            .populate("user", "name email");
        // ai condition na dilaw hoto. But nicher invoiceData er property type error resolve korar korar jonno condtion diasi.
        if (!updateBooking) {
            throw new AppError_1.default(401, "Booking update failed");
        }
        // payment complete hower pore user ke invoice create kore email korte hobe.
        const invoiceData = {
            bookingDate: updateBooking === null || updateBooking === void 0 ? void 0 : updateBooking.createdAt,
            guestCount: updateBooking === null || updateBooking === void 0 ? void 0 : updateBooking.guestCount,
            transactionId: updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.transactionId,
            totalAmount: updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.amount,
            tourTitle: (updateBooking === null || updateBooking === void 0 ? void 0 : updateBooking.tour).title,
            userName: (updateBooking === null || updateBooking === void 0 ? void 0 : updateBooking.user).name,
        };
        const pdfBuffer = yield (0, invoice_1.generatePdf)(invoiceData);
        // cloudinary te pdf ta upload korbo
        const cloudinaryResult = yield (0, cloudinary_config_1.uploadBufferToCloudinary)(pdfBuffer, "invoice");
        if (!cloudinaryResult) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_GATEWAY, "Error Uploading PDF");
        }
        // Payment collection a invoiceUrl take update kore upload kora pdf er link set kore dissi.
        yield payment_model_1.Payment.findByIdAndUpdate(updatedPayment._id, {
            invoiceUrl: cloudinaryResult.secure_url,
        }, { runValidators: true, session });
        yield (0, sendEmail_1.sendEmail)({
            to: updateBooking.user.email,
            subject: "Your Booking Invoice",
            templateName: "invoice",
            templateData: invoiceData,
            attachments: [
                {
                    filename: "invoice.pdf",
                    content: pdfBuffer,
                    contentType: "application/pdf",
                },
            ],
        });
        // --------------> end main code for this api
        // sobar last a and return er age ai code gulo likhte hobe..
        yield session.commitTransaction();
        session.endSession();
        return {
            success: true,
            message: "Payment Successfylly",
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const failPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query === null || query === void 0 ? void 0 : query.transactionId }, { status: payment_interface_1.PAYMENT_STATUS.FAILED }, { runValidators: true, session });
        yield booking_model_1.Booking.findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.booking, { status: booking_interface_1.BOOKING_STATUS.FAILED }, { runValidators: true, session });
        yield session.commitTransaction();
        session.endSession();
        return {
            success: false,
            message: "Payment failed",
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const cancelPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query === null || query === void 0 ? void 0 : query.transactionId }, { status: payment_interface_1.PAYMENT_STATUS.CANCELLED }, { runValidators: true, session });
        yield booking_model_1.Booking.findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.booking, { status: booking_interface_1.BOOKING_STATUS.CANCEL }, { runValidators: true, session });
        yield session.commitTransaction();
        session.endSession();
        return {
            success: false,
            message: "Payment cancel",
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const initPayment = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findOne({ booking: bookingId });
    if (!payment) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Payment not found. You have not booked this tour");
    }
    const booking = yield booking_model_1.Booking.findById(bookingId).populate("user", "name email phone address");
    const userName = (booking === null || booking === void 0 ? void 0 : booking.user).name;
    const userAddress = (booking === null || booking === void 0 ? void 0 : booking.user).address;
    const userEmail = (booking === null || booking === void 0 ? void 0 : booking.user).email;
    const userPhone = (booking === null || booking === void 0 ? void 0 : booking.user).phone;
    const sslPayload = {
        name: userName,
        email: userEmail,
        address: userAddress,
        phoneNumber: userPhone,
        amount: payment === null || payment === void 0 ? void 0 : payment.amount,
        transactionId: payment === null || payment === void 0 ? void 0 : payment.transactionId,
    };
    const sslPayment = yield sslCommerz_services_1.SSLServices.sslPaymentInit(sslPayload);
    return { paymentUrl: sslPayment === null || sslPayment === void 0 ? void 0 : sslPayment.GatewayPageURL };
});
const getInvoiceDownloadUrl = (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findById(paymentId).select("invoiceUrl");
    if (!payment) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Payment not found. You have not booked this tour");
    }
    if (!payment.invoiceUrl) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "No invoice found");
    }
    return payment.invoiceUrl;
});
exports.PaymentServices = {
    successPayment,
    failPayment,
    cancelPayment,
    initPayment,
    getInvoiceDownloadUrl,
};
