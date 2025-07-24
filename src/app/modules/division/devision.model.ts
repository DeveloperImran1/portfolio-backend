import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";

const divisionSchema = new Schema<IDivision>(
  {
    name: { type: String, unique: true, required: true },
    slug: { type: String, unique: true },
    thumbnail: { type: String },
    description: { type: String },
  },
  { timestamps: true, versionKey: false }
);

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
divisionSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    const baseSlug = this.name.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}-division`;

    let counter = 0;
    while (await Division.exists({ slug: slug })) {
      slug = `${slug}-${counter++}`; // Ex: rang-divisions-division-1
    }
    this.slug = slug;
  }
  next();
});

// findByIdAndUpdate hook sudho update query er somoi apply hobe.
divisionSchema.pre("findOneAndUpdate", async function (next) {
  // aikhane this er moddhe divisionSchemar property gulo pawa jabena. Kearon aita update korar hook. save hook hole pawa jeto. Tai this.getUpdate() ke call kore division ke niasi.
  const division = this.getUpdate() as Partial<IDivision>;
  if (division.name) {
    const baseSlug = division.name.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}-division`;

    let counter = 0;
    while (await Division.exists({ slug: slug })) {
      slug = `${slug}-${counter++}`; // Ex: rang-divisions-division-1
    }
    division.slug = slug;
  }

  // upore condition er moddhe division variable er moddhe slug ke add koresi. But this er moddhe add kora hoini. Tai setUpdate er maddhome korte hobe.
  this.setUpdate(division);
  next();
});

export const Division = model<IDivision>("Division", divisionSchema);
