"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const payment_controller_1 = require("./payment.controller");
const router = (0, express_1.Router)();
router.post("/success", payment_controller_1.PaymentController.successPayment);
router.post("/fail", payment_controller_1.PaymentController.failPayment);
router.post("/cancel", payment_controller_1.PaymentController.cancelPayment);
router.post("/init-payment/:bookingId", payment_controller_1.PaymentController.initPayment);
// User tar booking korar por payment er invoice pdf ta get korte parbe ai api dia.
router.get("/invoice/:paymentId", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), payment_controller_1.PaymentController.getInvoiceDownloadUrl);
router.post("/validate-payment", payment_controller_1.PaymentController.validatePayment);
exports.PaymentRoutes = router;
