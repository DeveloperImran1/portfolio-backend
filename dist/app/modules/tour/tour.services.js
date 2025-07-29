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
exports.TourServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const cloudinary_config_1 = require("../../../config/cloudinary.config");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const tour_constant_1 = require("./tour.constant");
const tour_model_1 = require("./tour.model");
const createTour = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const baseSlug = payload.title.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}`;
    let counter = 0;
    while (yield tour_model_1.Tour.exists({ slug: slug })) {
        slug = `${slug}-${counter++}`; // Ex: rang-divisions-division-1
    }
    payload.slug = slug;
    const tour = yield tour_model_1.Tour.create(payload);
    return tour;
});
// Custom api. Without QueryBuilder
// const getAllTour = async (query: Record<string, string>) => {
//   const filter = query;
//   const searchTerm = filter.searchTerm || ""; // string data
//   const sort = filter.sort || "-createdAt"; // sort a kono value na asle default value use hobe. Ar sort er value hisabe hobe holo: propertyName. Jei property ke use kore sort kora hobe. Akhon porpertyName er age minus add korle descending ar positive name hole ascending onujaie sort hobe. Aikhane "-createdAt" dara bujhasse time onujaie sobar boro theke soto sort koro.
//   // field filtering --> jokhon kiso property ke get korte hoi tokhon aita kaje lage.
//   const fields = filter?.fields?.split(",").join(" ") || ""; // ai fileds variable a jodi akta field name send kori tahole sudho akta field name dilai hobe. Ar jodi akadhik field ke get korte chai tahole comma separete na hoia space separete hobe. Ex: fields = "title location"; But front-end theke comma separete a asbe. Tai split and join use kore space separete kore niasi.
//   const page = Number(filter?.page) || 1;
//   const limit = Number(filter?.limit) || 10;
//   const skip = (page - 1) * limit;
//   // filter variable er moddhe searchTerm filter oo asbe. Tai filter variable theke searchTerm ke delete kore dilam.
//   // delete filter["searchTerm"];
//   // delete filter["sort"];
//   // uporer every property ke akta akta kore delete na kore, loop chalia delete korte pari.
//   // const excludedField = ["searchTerm", "sort"];  // jeheto aita akta constant type er. ba bivinno somoi aikhane new property name add korte hobe. tai tour.constant.ts file a ba root theke constants.ts file a add kore export korte pari.
//   for (const field of excludedField) {
//     delete filter[field];
//   }
//   // const tour = await Tour.find({
//   // Way 1:
//   // title: searchTerm,  // aita every title field ke exactly match korle output a a return korbe.
//   // Way 2:
//   // title: { $regex: searchTerm, $options: "i" },  // aita search hisabe kaj korbe. Jodi title property er valuer sathe exact match na kore, akto match kore. Taholew filter korbe.
//   // Way 3:
//   // Jodi need pore akadhik property er upor search korbo, tahole $or operator er moddhe korte hobe.
//   // $or: [
//   //   { title: { $regex: searchTerm, $options: "i" } },
//   //   { description: { $regex: searchTerm, $options: "i" } },
//   //   { location: { $regex: searchTerm, $options: "i" } },
//   // ],
//   // Way 4:
//   // upore all kaj same sudho property name gulo change hosse. Tai amra array ke map kore ai kajta shortly korte pari.
//   //
//   //
//   // });
//   // Way 5:
//   // Uporer filter ta korar aro akta effisient way holo full filter take akta variable er moddhe likha, sudho sei qeury take find() er moddhe bosate pari.
//   const searchQuery = {
//     $or: tourSearchableFields.map((field) => ({
//       [field]: { $regex: searchTerm, $options: "i" }, // aikhane field ke property hisabe use korte hole [] array er moddhe likhte hobe.
//     })),
//   };
//   // const tour = await Tour.find(searchQuery);
//   // Way 6:
//   // aikhane akbar find kore, abar oi result er upor find kora jai aivbae.
//   // const tour = await Tour.find(searchQuery)
//   //   .find(filter)
//   //   .sort(sort)
//   //   .select(fields) // aikhane .select("propertyName") dila sudho oi property gulo output a asbe. But jodi propertyName er age minus dei. Ex: .select("-title") tahole title field bade baki all field output a asbe.
//   //   .skip(skip)
//   //   .limit(limit);
//   // Way 7:  aikhane akta akta kore find chalaisi and variable er moddhe store koresi. But await use korini. Last step a gia await use korte hobe. Jeita sobar last query.
//   const filterQuery = Tour.find(searchQuery);
//   const tours = filterQuery.find(filter);
//   const allTours = await tours
//     .sort(sort)
//     .select(fields)
//     .skip(skip)
//     .limit(limit);
//   const totalTour = await Tour.countDocuments();
//   const meta = {
//     page: page,
//     limit: limit,
//     total: totalTour,
//     totalPage: Math.ceil(totalTour / limit),
//   };
//   return {
//     meta: meta,
//     data: allTours,
//   };
// };
// With QueryBuilder
const getAllTour = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(tour_model_1.Tour.find(), query);
    const tours = yield queryBuilder
        .search(tour_constant_1.tourSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    // .build();  // niche arrayke distucture kore korte hole aikhane build ke call korte hobena.
    // const meta = await queryBuilder.getMeta();  // aivabe korlew hobe. But nicher niom a kortesi.
    const [data, meta] = yield Promise.all([
        tours.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        meta,
        data,
    };
});
const getSingleTour = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const tour = yield tour_model_1.Tour.findOne({ slug });
    return tour;
});
const updateTour = (tourId, paylaod) => __awaiter(void 0, void 0, void 0, function* () {
    if (!Object.keys(paylaod).length) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You donot modify any field");
    }
    const isTourExist = yield tour_model_1.Tour.findById(tourId);
    if (!isTourExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Tour not exist");
    }
    // payload er moddhe title asle slug kew update kore diasi. But ai kajta tour.model.ts file a pre hook er maddhome kora hoiase.
    // if (paylaod.title) {
    //   const baseSlug = paylaod.title.toLowerCase().split(" ").join("-");
    //   let slug = `${baseSlug}`;
    //   let counter = 0;
    //   while (await Tour.exists({ slug: slug })) {
    //     slug = `${slug}-${counter++}`;
    //   }
    //   paylaod.slug = slug;
    // }
    // CASE 1: jodi ager image gulor sathe new image add korte chai. Tahole nicher moto kore ager images arrayte new image set kore diasi.
    if (paylaod.images &&
        (paylaod === null || paylaod === void 0 ? void 0 : paylaod.images.length) > 0 &&
        isTourExist.images &&
        (isTourExist === null || isTourExist === void 0 ? void 0 : isTourExist.images.length) > 0) {
        paylaod.images = [...paylaod.images, ...isTourExist.images];
    }
    // CASE 2: Previous kono images array theke fixed kiso image delete korte pari. Jar jonno interface, mongoose schema, zod schema te “deleteImages” namer akta property nia rakhte pari. User jei jei image delete korbe. Sei sei image gulo select korle oi deleteImages property er moddhe kore backend a nia ase, oi image er url theke public id ke extract kore delete korte pari. And same time a mongodb er ager images gulo theke filter chalia mondodb thekew delete korte pari. Ai deleteImages property kinto amader DB te set hobena. aita sudho delete korar jonno newa hoiase.
    if (paylaod.deleteImages &&
        paylaod.deleteImages.length > 0 &&
        isTourExist.images &&
        isTourExist.images.length > 0) {
        // 1st step: mongodb theke arger images gulor sathe fileter kore noew images array create kora:
        // DB te jei images gulo ase, tader theke deleteImages array er image gulo remove korlam.
        const restDBImages = isTourExist.images.filter((imageUrl) => { var _a; return !((_a = paylaod.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(imageUrl)); });
        const updatedPayloadImages = ((paylaod === null || paylaod === void 0 ? void 0 : paylaod.images) || [])
            .filter((imageUrl) => { var _a; return !((_a = paylaod.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(imageUrl)); })
            .filter((imageUrl) => !(restDBImages === null || restDBImages === void 0 ? void 0 : restDBImages.includes(imageUrl)));
        paylaod.images = [...restDBImages, ...updatedPayloadImages];
        // 2nd Step: a Cloudinary theke delete korte hobe. Aita aikhane kora thik hobena. Karon DB te age update korar pore delete korte hobe. Otherwise kono error throw hole, ager image gulo invalid hoia jabe.
    }
    const updatedTour = yield tour_model_1.Tour.findByIdAndUpdate(tourId, paylaod, {
        new: true,
        runValidators: true,
    });
    // delete images from cloudinary
    if (paylaod.deleteImages &&
        paylaod.deleteImages.length > 0 &&
        isTourExist.images &&
        isTourExist.images.length > 0) {
        yield Promise.all(paylaod.deleteImages.map((url) => (0, cloudinary_config_1.deleteImageFromCloudinary)(url)));
    }
    return updatedTour;
});
const deleteTour = (tourId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!tourId) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You donot provide tourId");
    }
    yield tour_model_1.Tour.findByIdAndDelete(tourId);
    return null;
});
exports.TourServices = {
    createTour,
    getAllTour,
    updateTour,
    deleteTour,
    getSingleTour,
};
