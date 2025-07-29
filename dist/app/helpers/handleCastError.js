"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCastError = void 0;
const handleCastError = (error) => {
    return {
        statusCode: 400,
        message: "Invalid MongoDB ObjectID",
    };
};
exports.handleCastError = handleCastError;
