"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleZodError = void 0;
const handleZodError = (error) => {
    const errorSources = [];
    error.issues.forEach((errObj) => errorSources.push({
        path: errObj.path[errObj.path.length - 1], // Aivabew kora jai. But nicher niom a korle aro well structured hoi.
        // path: errObj.path.reverse().join(" instead "),
        message: errObj.message,
    }));
    return {
        statusCode: 400,
        message: "Zod Validation Error",
        errorSources,
    };
};
exports.handleZodError = handleZodError;
