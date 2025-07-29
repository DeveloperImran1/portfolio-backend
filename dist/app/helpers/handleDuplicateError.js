"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDuplicateKeyError = void 0;
const handleDuplicateKeyError = (error) => {
    const matchedArr = error.message.match(/"([^"]*)"/);
    return {
        statusCode: 400,
        message: `${matchedArr[1]} already exist`,
    };
};
exports.handleDuplicateKeyError = handleDuplicateKeyError;
