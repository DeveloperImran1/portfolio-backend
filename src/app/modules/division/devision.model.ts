import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";

const divisionSchema = new Schema<IDivision>(
  {
    name: { type: String, unique: true, required: true },
    slug: { type: String, unique: true, required: true },
    thumbnail: { type: String, unique: true, required: true },
    description: { type: String, unique: true, required: true },
  },
  { timestamps: true }
);

export const Division = model<IDivision>("Division", divisionSchema);
