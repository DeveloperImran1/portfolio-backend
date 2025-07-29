"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const payment_interface_1 = require("./payment.interface");
const paymentSchema = new mongoose_1.Schema({
    booking: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Booking",
        unique: true,
        required: true,
    },
    transactionId: {
        type: String,
        unique: true,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(payment_interface_1.PAYMENT_STATUS),
        default: payment_interface_1.PAYMENT_STATUS.UNPAID,
    },
    amount: {
        type: Number,
        required: true,
    },
    invoiceUrl: {
        type: String,
    },
    paymentGatewayData: mongoose_1.Schema.Types.Mixed, // amra interface a paymentGatewayData er type hisabe any use koresi. Tai aikhane Schema.Types.Mixed hobe. Thats mean jekono kiso aste pare.
}, { timestamps: true });
exports.Payment = (0, mongoose_1.model)("Payment", paymentSchema);
