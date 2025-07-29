"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourType = void 0;
const mongoose_1 = require("mongoose");
const tourTypeSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
}, { versionKey: false, timestamps: true });
exports.TourType = (0, mongoose_1.model)("TourType", tourTypeSchema);
