import { model, Schema } from "mongoose";
import { ITour } from "./tour.interface";

const tourSchema = new Schema<ITour>(
  {
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
    division: { type: Schema.Types.ObjectId, ref: "Division", required: true },
    tourType: { type: Schema.Types.ObjectId, ref: "TourType", required: true },
    departureLocation: { type: String },
    arrivalLocation: { type: String },
  },
  { versionKey: false, timestamps: true }
);

// 🔷 pre-save hook to auto-generate slug from title
// tourSchema.pre("save", function (next) {
//   if (!this.slug) {
//     this.slug = slugify(this.title, { lower: true, strict: true });
//   }
//   next();
// });

// save hook sudho create and save query er somoi apply hobe.
tourSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    const baseSlug = this.title.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}`;

    let counter = 0;
    while (await Tour.exists({ slug })) {
      slug = `${slug}-${counter++}`; // Ex: rang-divisions-division-1
    }
    this.slug = slug;
  }
  next();
});

// findByIdAndUpdate hook sudho update query er somoi apply hobe.
tourSchema.pre("findOneAndUpdate", async function (next) {
  // aikhane this er moddhe divisionSchemar property gulo pawa jabena. Kearon aita update korar hook. save hook hole pawa jeto. Tai this.getUpdate() ke call kore division ke niasi.
  const tour = this.getUpdate() as Partial<ITour>;
  if (tour.title) {
    const baseSlug = tour.title.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}`;

    let counter = 0;
    while (await Tour.exists({ slug })) {
      slug = `${slug}-${counter++}`; // Ex: rang-divisions-division-1
    }
    tour.slug = slug;
  }

  // upore condition er moddhe division variable er moddhe slug ke add koresi. But this er moddhe add kora hoini. Tai setUpdate er maddhome korte hobe.
  this.setUpdate(tour);
  next();
});

export const Tour = model<ITour>("Tour", tourSchema);
