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
exports.TourTypeServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const tourType_model_1 = require("./tourType.model");
const createTourType = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isTourTypeExist = yield tourType_model_1.TourType.findOne({ name: payload.name });
    if (isTourTypeExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "This Tour Type already Exist");
    }
    const tourType = yield tourType_model_1.TourType.create(payload);
    return tourType;
});
const getAllTourType = () => __awaiter(void 0, void 0, void 0, function* () {
    const tourType = yield tourType_model_1.TourType.find();
    const totalTourType = yield tourType_model_1.TourType.countDocuments();
    return {
        data: tourType,
        meta: {
            total: totalTourType,
        },
    };
});
const getSingleTourType = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const tourType = yield tourType_model_1.TourType.findOne({ _id: id });
    return {
        data: tourType,
    };
});
const updateTourType = (tourTypeId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload.name) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Please modify name field");
    }
    const isTourTypeExist = yield tourType_model_1.TourType.findById(tourTypeId);
    if (!isTourTypeExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "This Tour Type not found");
    }
    const updateTourType = yield tourType_model_1.TourType.findByIdAndUpdate(tourTypeId, payload, {
        new: true,
        runValidators: true,
    });
    return updateTourType;
});
const deleteTourType = (tourTypeId) => __awaiter(void 0, void 0, void 0, function* () {
    const isTourTypeExist = yield tourType_model_1.TourType.findById(tourTypeId);
    if (!isTourTypeExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "This Tour Type not found");
    }
    // ensure koro, ai tourType onno kono collection a refference hisabe add nai. Jodi reference hisabe thake, tahole error message dia return kore daw.
    //
    //
    //
    yield tourType_model_1.TourType.findByIdAndDelete(tourTypeId);
    return;
});
exports.TourTypeServices = {
    createTourType,
    getAllTourType,
    updateTourType,
    deleteTourType,
    getSingleTourType,
};
