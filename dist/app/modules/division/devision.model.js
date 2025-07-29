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
exports.Division = void 0;
const mongoose_1 = require("mongoose");
const divisionSchema = new mongoose_1.Schema({
    name: { type: String, unique: true, required: true },
    slug: { type: String, unique: true },
    thumbnail: { type: String },
    description: { type: String },
}, { timestamps: true, versionKey: false });
// aita akta package use kore kortesi, but manualy koreci division.services.ts a
// 🔷 pre-save hook to auto-generate slug from name
// divisionSchema.pre("save", function (next) {
//   if (!this.slug) {
//     this.slug = slugify(this.name, { lower: true, strict: true });
//   }
//   next();
// });
// Uporer hook ta package use koresi, but aita manualy korbo:
// save hook sudho create and save query er somoi apply hobe.
divisionSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("name")) {
            const baseSlug = this.name.toLowerCase().split(" ").join("-");
            let slug = `${baseSlug}-division`;
            let counter = 0;
            while (yield exports.Division.exists({ slug: slug })) {
                slug = `${slug}-${counter++}`; // Ex: rang-divisions-division-1
            }
            this.slug = slug;
        }
        next();
    });
});
// findByIdAndUpdate hook sudho update query er somoi apply hobe.
divisionSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // aikhane this er moddhe divisionSchemar property gulo pawa jabena. Kearon aita update korar hook. save hook hole pawa jeto. Tai this.getUpdate() ke call kore division ke niasi.
        const division = this.getUpdate();
        if (division.name) {
            const baseSlug = division.name.toLowerCase().split(" ").join("-");
            let slug = `${baseSlug}-division`;
            let counter = 0;
            while (yield exports.Division.exists({ slug: slug })) {
                slug = `${slug}-${counter++}`; // Ex: rang-divisions-division-1
            }
            division.slug = slug;
        }
        // upore condition er moddhe division variable er moddhe slug ke add koresi. But this er moddhe add kora hoini. Tai setUpdate er maddhome korte hobe.
        this.setUpdate(division);
        next();
    });
});
exports.Division = (0, mongoose_1.model)("Division", divisionSchema);
