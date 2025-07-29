import httpStatus from "http-status-codes";
import { deleteImageFromCloudinary } from "../../../config/cloudinary.config";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { Division } from "./devision.model";
import { divisionSearchableFields } from "./division.constant";
import { IDivision } from "./division.interface";

const createDivision = async (paylaod: IDivision) => {
  const isExist = await Division.findOne({ name: paylaod?.name });

  if (isExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "This Division Already Exist!");
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
  const division = await Division.create(paylaod);
  return division;
};

const getAllDivision = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Division.find(), query);
  const division = await queryBuilder
    .search(divisionSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    division.build(),
    queryBuilder.getMeta(),
  ]);
  return {
    meta,
    data,
  };
};

const getSingleDivision = async (slug: string) => {
  const division = await Division.findOne({ slug });

  return {
    data: division,
  };
};

const updateDivision = async (
  divisionId: string,
  payload: Partial<IDivision>
) => {
  // ai condition check na korleo hobe. Because zod schemate slug ke remove koresi. Thts mean front-end theke slug field aslew, zod schemar maddhome slug field remove hoia aikhane asbe.
  if (payload.slug) {
    throw new AppError(httpStatus.BAD_REQUEST, "You cannot modify slug");
  }

  if (!payload.description && !payload.name && !payload.thumbnail) {
    throw new AppError(httpStatus.BAD_REQUEST, "You donot modify any field");
  }

  const isDivisionExist = await Division.findById(divisionId);

  if (!isDivisionExist) {
    throw new AppError(httpStatus.NOT_FOUND, "This division not exist");
  }

  // aita check kortese, updated name , jeita payload theke astece, oi name a previous kono division already ase kina. Thakle error dibo. Because divisionName unique. Aita aikhane na korlew hoto. Because mongoose schema the name: unique true kora ase. DB te update korar somoi error dia dito.
  const duplicateDivision = await Division.findOne({
    name: payload.name,
    _id: { $ne: divisionId },
  });

  if (duplicateDivision) {
    throw new AppError(httpStatus.NOT_FOUND, "A division name already exist");
  }

  // update korar payload a name property thakle package er maddhome slug ke update kore dissi. Ai kajta division.controller.ts file a manualy kora hoisa.
  // if (payload.name) {
  //   payload.slug = slugify(payload.name, { lower: true, strict: true });
  // }

  const newUpdateDivision = await Division.findByIdAndUpdate(
    divisionId,
    payload,
    {
      new: true,
      runValidators: true,
    }
  );

  // division update hower pore previous image ke delete korte hobe. Otherwise update korar age korle issue hobe, jodi cloudinary theke delete holo. But kono karone division update holona. Tahole ager image ta invalid hoia thakbe.
  // Abar division update holo thik ase. But jodi cloudinary theke delete korte kono error hoi. Tar jonno Transaction rollback er moddeh all kaj korte pari. Jar fole last operation cloudinary theke image delete korar age porjonto kono error hole uporer update er kaj rollback hoia ager obosthai jabe.
  if (payload.thumbnail && isDivisionExist.thumbnail) {
    await deleteImageFromCloudinary(isDivisionExist.thumbnail);
  }

  return newUpdateDivision;
};

const deleteDivision = async (divisionId: string) => {
  const isDivisionExist = await Division.findById(divisionId);

  if (!isDivisionExist) {
    throw new AppError(httpStatus.NOT_FOUND, "This division not exist");
  }

  // akta division delete korar age, vabte hobe ai division er objectId kon kono collection a refference hisabe ase. Jei jei collection a refference key hisabe ase. Sei collection er data gulo invalid hobe. So jodi Tour collection ba onno kono collection a divisionId er sathe ai params theke asa id match kore, tahole return error – “Cannot delete. Division has associated tours.”
  //
  //
  //

  const deleteDivision = await Division.findByIdAndDelete(divisionId);

  return deleteDivision;
};

export const DivisionServices = {
  createDivision,
  getAllDivision,
  updateDivision,
  deleteDivision,
  getSingleDivision,
};
