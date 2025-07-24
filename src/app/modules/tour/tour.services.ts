import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { tourSearchableFields } from "./tour.constant";
import { ITour } from "./tour.interface";
import { Tour } from "./tour.model";

const createTour = async (payload: ITour) => {
  const baseSlug = payload.title.toLowerCase().split(" ").join("-");
  let slug = `${baseSlug}`;

  let counter = 0;
  while (await Tour.exists({ slug: slug })) {
    slug = `${slug}-${counter++}`; // Ex: rang-divisions-division-1
  }
  payload.slug = slug;

  const tour = await Tour.create(payload);
  return tour;
};

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
const getAllTour = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Tour.find(), query);
  const tours = await queryBuilder
    .search(tourSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();
  // .build();  // niche arrayke distucture kore korte hole aikhane build ke call korte hobena.

  // const meta = await queryBuilder.getMeta();  // aivabe korlew hobe. But nicher niom a kortesi.
  const [data, meta] = await Promise.all([
    tours.build(),
    queryBuilder.getMeta(),
  ]);
  return {
    meta,
    data,
  };
};

const getSingleTour = async (slug: string) => {
  const tour = await Tour.findOne({ slug });
  return tour;
};

const updateTour = async (tourId: string, paylaod: Partial<ITour>) => {
  if (!Object.keys(paylaod).length) {
    throw new AppError(httpStatus.BAD_REQUEST, "You donot modify any field");
  }

  const isTourExist = await Tour.findById(tourId);
  if (!isTourExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Tour not exist");
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

  const updatedTour = await Tour.findByIdAndUpdate(tourId, paylaod, {
    new: true,
    runValidators: true,
  });

  return updatedTour;
};

const deleteTour = async (tourId: string) => {
  if (!tourId) {
    throw new AppError(httpStatus.BAD_REQUEST, "You donot provide tourId");
  }

  await Tour.findByIdAndDelete(tourId);

  return null;
};

export const TourServices = {
  createTour,
  getAllTour,
  updateTour,
  deleteTour,
  getSingleTour,
};
