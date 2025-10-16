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
exports.QueryBuilder = void 0;
const constants_1 = require("../constants");
// QueryBuilder class for all get method
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery; // kon collectinon ke find korbo seita asbe. Ex: Tour.find()
        this.query = query; // query hisabe asa object ta asbe. Jar moddhe search, filter, min, max, limit etc sob kisoi thakbe. Ex: { searchTerm: "Dhaka", limit: "10" }
    }
    filter() {
        const filter = Object.assign({}, this.query); // Ai line er mane holo filter variable er moddhe query er akta copy set kore dissi. Ai qury ba filter er moddhe sokol query ase. So tar moddhe theke jeigulo direct property and value dia filter korte hio. seigulo sara bakiderke delete kore dissa filter object theke. But aita query object ke kono effect felbena. Karon spread operator dia copy kora hoisa.
        for (const field of constants_1.excludedField) {
            delete filter[field];
        }
        // ager model qury te set hoia ase perameter a asa modelQuery er value Tour.find() akhon aitake abar ager Tour.find() er sathe abar .find(filter) set kortesi. Jar fole filter object er moddhe thaka property and value dia db theke filter kore data get korbe.
        this.modelQuery = this.modelQuery.find(filter); // Ex: Tour.find().find(filter)
        return this;
    }
    search(searchableFields) {
        const searchTerm = this.query.searchTerm || "";
        const searchQuery = {
            $or: searchableFields.map((field) => ({
                [field]: { $regex: searchTerm, $options: "i" }, // aikhane field ke property hisabe use korte hole [] array er moddhe likhte hobe.
            })),
        };
        this.modelQuery = this.modelQuery.find(searchQuery);
        return this;
    }
    sort() {
        var _a;
        const sort = ((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.sort) || "-createdAt"; // sort a kono value na asle default value use hobe. Ar sort er value hisabe hobe holo: propertyName. Jei property ke use kore sort kora hobe. Akhon porpertyName er age minus add korle descending ar positive name hole ascending onujaie sort hobe. Aikhane "-createdAt" dara bujhasse time onujaie sobar boro theke soto sort koro.
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    fields() {
        var _a, _b;
        // field filtering --> jokhon kiso property ke get korte hoi tokhon aita kaje lage.
        const fields = ((_b = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.fields) === null || _b === void 0 ? void 0 : _b.split(",").join(" ")) || ""; // ai fileds variable a jodi akta field name send kori tahole sudho akta field name dilai hobe. Ar jodi akadhik field ke get korte chai tahole comma separete na hoia space separete hobe. Ex: fields = "title location"; But front-end theke comma separete a asbe. Tai split and join use kore space separete kore niasi.
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
    paginate() {
        var _a, _b;
        const page = Number((_a = this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
        const limit = Number((_b = this.query) === null || _b === void 0 ? void 0 : _b.limit) || 10;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    build() {
        return this.modelQuery;
    }
    getMeta() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            // const totalDocuments = await this.modelQuery.countDocuments();  // Output: Tour.find().countDocuments(); aivabe call hosse. But call howa doekar modelName.countDocuments() tai niche modelQuery theke sudho modelName ke get korese. model property ke chainig er maddhome
            const totalDocuments = yield this.modelQuery.model.countDocuments();
            const page = Number((_a = this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
            const limit = Number((_b = this.query) === null || _b === void 0 ? void 0 : _b.limit) || 10;
            const totalPage = Math.ceil(totalDocuments / limit);
            return { page, limit, total: totalDocuments, totalPage };
        });
    }
}
exports.QueryBuilder = QueryBuilder;
