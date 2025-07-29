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
exports.DivisionServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const cloudinary_config_1 = require("../../../config/cloudinary.config");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const devision_model_1 = require("./devision.model");
const division_constant_1 = require("./division.constant");
const createDivision = (paylaod) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield devision_model_1.Division.findOne({ name: paylaod === null || paylaod === void 0 ? void 0 : paylaod.name });
    if (isExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "This Division Already Exist!");
    }
    // division er slug create korar kajta division.model er moddhe divisionSchema.save() er maddhome new division create korar age akta package use kore create koresi. But ai slug create korata manualy aivabew kora jai.
    // const baseSlug = paylaod.name.toLowerCase().split(" ").join("-");
    // let slug = `${baseSlug}-division`;
    // let counter = 0;
    // while (await Division.exists({ slug: slug })) {
    //   slug = `${slug}-${counter++}`; // Ex: rang-divisions-division-1
    // }
    // paylaod.slug = slug;
    // create division
    const division = yield devision_model_1.Division.create(paylaod);
    return division;
});
const getAllDivision = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(devision_model_1.Division.find(), query);
    const division = yield queryBuilder
        .search(division_constant_1.divisionSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        division.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        meta,
        data,
    };
});
const getSingleDivision = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const division = yield devision_model_1.Division.findOne({ slug });
    return {
        data: division,
    };
});
const updateDivision = (divisionId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // ai condition check na korleo hobe. Because zod schemate slug ke remove koresi. Thts mean front-end theke slug field aslew, zod schemar maddhome slug field remove hoia aikhane asbe.
    if (payload.slug) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You cannot modify slug");
    }
    if (!payload.description && !payload.name && !payload.thumbnail) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You donot modify any field");
    }
    const isDivisionExist = yield devision_model_1.Division.findById(divisionId);
    if (!isDivisionExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "This division not exist");
    }
    // aita check kortese, updated name , jeita payload theke astece, oi name a previous kono division already ase kina. Thakle error dibo. Because divisionName unique. Aita aikhane na korlew hoto. Because mongoose schema the name: unique true kora ase. DB te update korar somoi error dia dito.
    const duplicateDivision = yield devision_model_1.Division.findOne({
        name: payload.name,
        _id: { $ne: divisionId },
    });
    if (duplicateDivision) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "A division name already exist");
    }
    // update korar payload a name property thakle package er maddhome slug ke update kore dissi. Ai kajta division.controller.ts file a manualy kora hoisa.
    // if (payload.name) {
    //   payload.slug = slugify(payload.name, { lower: true, strict: true });
    // }
    const newUpdateDivision = yield devision_model_1.Division.findByIdAndUpdate(divisionId, payload, {
        new: true,
        runValidators: true,
    });
    // division update hower pore previous image ke delete korte hobe. Otherwise update korar age korle issue hobe, jodi cloudinary theke delete holo. But kono karone division update holona. Tahole ager image ta invalid hoia thakbe.
    // Abar division update holo thik ase. But jodi cloudinary theke delete korte kono error hoi. Tar jonno Transaction rollback er moddeh all kaj korte pari. Jar fole last operation cloudinary theke image delete korar age porjonto kono error hole uporer update er kaj rollback hoia ager obosthai jabe.
    if (payload.thumbnail && isDivisionExist.thumbnail) {
        yield (0, cloudinary_config_1.deleteImageFromCloudinary)(isDivisionExist.thumbnail);
    }
    return newUpdateDivision;
});
const deleteDivision = (divisionId) => __awaiter(void 0, void 0, void 0, function* () {
    const isDivisionExist = yield devision_model_1.Division.findById(divisionId);
    if (!isDivisionExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "This division not exist");
    }
    // akta division delete korar age, vabte hobe ai division er objectId kon kono collection a refference hisabe ase. Jei jei collection a refference key hisabe ase. Sei collection er data gulo invalid hobe. So jodi Tour collection ba onno kono collection a divisionId er sathe ai params theke asa id match kore, tahole return error – “Cannot delete. Division has associated tours.”
    //
    //
    //
    const deleteDivision = yield devision_model_1.Division.findByIdAndDelete(divisionId);
    return deleteDivision;
});
exports.DivisionServices = {
    createDivision,
    getAllDivision,
    updateDivision,
    deleteDivision,
    getSingleDivision,
};
