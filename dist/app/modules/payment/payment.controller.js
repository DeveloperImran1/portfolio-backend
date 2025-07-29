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
exports.PaymentController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../../../config/env");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const sslCommerz_services_1 = require("../sslCommerz/sslCommerz.services");
const payment_services_1 = require("./payment.services");
// Situation 1:
// Front-end (localhost:5173) -> User -> tour -> Booking(PENDING) -> Payment(UNPAID) -> SSL Commerz page -> Payment complete -> Backend (localhost: 5000) -> Update Payment(PAID) & Update Booking(PAID) -> redirect to front-end -> Front-end(localhost:5173/payment/success)
// Situation 2:
// Front-end (localhost:5173) -> User -> tour -> Booking(PENDING) -> Payment(UNPAID) -> SSL Commerz page -> Payment complete -> Backend (localhost: 5000) -> Update Payment(FAIL/CANCEL) & Update Booking(FAIL/CANCEL) -> redirect to front-end -> Front-end(localhost:5173/payment/fail or cancel)
const successPayment = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield payment_services_1.PaymentServices.successPayment(query);
    if (result === null || result === void 0 ? void 0 : result.success) {
        res.redirect(`${env_1.envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result === null || result === void 0 ? void 0 : result.message}&amount=${query.amount}&status=success`);
    }
}));
const failPayment = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield payment_services_1.PaymentServices.failPayment(query);
    if (!(result === null || result === void 0 ? void 0 : result.success)) {
        res.redirect(`${env_1.envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result === null || result === void 0 ? void 0 : result.message}&amount=${query.amount}&status=fail`);
    }
}));
const cancelPayment = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield payment_services_1.PaymentServices.cancelPayment(query);
    if (!(result === null || result === void 0 ? void 0 : result.success)) {
        res.redirect(`${env_1.envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result === null || result === void 0 ? void 0 : result.message}&amount=${query.amount}&status=cancel`);
    }
}));
// Upore amra koreci jokhon booking korbe user, tokhon booking hoia payment korar jonno ssl commerz er api a hit korbe. Tarpor responce asbe, sei repoonce er upor depend kore successPayment, failpayment, cancelPayment api call hobe and payment, booking er status update kore front-end a redirect kortese.
// But jodi user akbar bookin kore, kono karone payment cancel kore ba fail hoi. Tahole user next time abar set ageb booking a payment korte chaile. initPayment api use hobe. Ai api er maddhome front-end theke booking id ta asbe. Sei id dia check korbo, asolei ki DB te ai booking er kono fail ba cancel howa payment ase kina. Jodi thake tahole ssl coomerze er payment korar api te abar hit kore payment korte dibo user ke. Jodi payment kore tahole respopnse er maddhome payment and booking er status update kore front-end a redirect kore dibo success page a.
const initPayment = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingId = req.params.bookingId;
    const result = yield payment_services_1.PaymentServices.initPayment(bookingId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Payment done successfully",
        data: result,
    });
}));
const getInvoiceDownloadUrl = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentId = req.params.paymentId;
    const result = yield payment_services_1.PaymentServices.getInvoiceDownloadUrl(paymentId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Invoice Download URL Retrive successfully",
        data: result,
    });
}));
const validatePayment = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield sslCommerz_services_1.SSLServices.validatePayment(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Payment validation successfully",
        data: null,
    });
}));
exports.PaymentController = {
    successPayment,
    failPayment,
    cancelPayment,
    initPayment,
    getInvoiceDownloadUrl,
    validatePayment,
};
