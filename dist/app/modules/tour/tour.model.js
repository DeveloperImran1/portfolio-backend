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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tour = void 0;
const mongoose_1 = require("mongoose");
const tourSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String },
    images: { type: [String], default: [] },
    location: { type: String },
    costFrom: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    tourPlan: { type: Number },
    maxGuest: { type: Number },
    minAge: { type: Number },
    division: { type: mongoose_1.Schema.Types.ObjectId, ref: "Division", required: true },
    tourType: { type: mongoose_1.Schema.Types.ObjectId, ref: "TourType", required: true },
    departureLocation: { type: String },
    arrivalLocation: { type: String },
}, { versionKey: false, timestamps: true });
// 🔷 pre-save hook to auto-generate slug from title
// tourSchema.pre("save", function (next) {
//   if (!this.slug) {
//     this.slug = slugify(this.title, { lower: true, strict: true });
//   }
//   next();
// });
// save hook sudho create and save query er somoi apply hobe.
tourSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("title")) {
            const baseSlug = this.title.toLowerCase().split(" ").join("-");
            let slug = `${baseSlug}`;
            let counter = 0;
            while (yield exports.Tour.exists({ slug })) {
                slug = `${slug}-${counter++}`; // Ex: rang-divisions-division-1
            }
            this.slug = slug;
        }
        next();
    });
});
// findByIdAndUpdate hook sudho update query er somoi apply hobe.
tourSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // aikhane this er moddhe divisionSchemar property gulo pawa jabena. Kearon aita update korar hook. save hook hole pawa jeto. Tai this.getUpdate() ke call kore division ke niasi.
        const tour = this.getUpdate();
        if (tour.title) {
            const baseSlug = tour.title.toLowerCase().split(" ").join("-");
            let slug = `${baseSlug}`;
            let counter = 0;
            while (yield exports.Tour.exists({ slug })) {
                slug = `${slug}-${counter++}`; // Ex: rang-divisions-division-1
            }
            tour.slug = slug;
        }
        // upore condition er moddhe division variable er moddhe slug ke add koresi. But this er moddhe add kora hoini. Tai setUpdate er maddhome korte hobe.
        this.setUpdate(tour);
        next();
    });
});
exports.Tour = (0, mongoose_1.model)("Tour", tourSchema);
