"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionId = void 0;
const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.ceil(Math.random() * 1000)}`;
};
exports.getTransactionId = getTransactionId;
