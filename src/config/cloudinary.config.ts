import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";

// Front-end -> form-data with image file -> Multer -> form-data -> Req (Body + File)
// Amra age cloudinary te image upload kore image link generate kore front-end theke json akare send kortam. But multer package er maddhome image er file, ba pdf, cvs file ke send kora jai form-datar maddhome. Backend a Multer er maddhome image file ke req.File er moddhe save kore and other data gulo ke req.Body er moddhe save kore. Tarpor backend a jei cloud use korbo. ex: Cloudinary te sei file gulo upload kore link generate korte parbo.

// Akhon bisoy hosse backend a multer form-data theke image file ke req.File er moddhe kivabe save kortese?? Aita backend a multer nijer akta temporary folder create kortese. Jar moddhe form-data theke asa data gulo ke store kore. Ai folder ta amader project er moddhe ba amader local-computer a kore.

// But aikhane Multer storage cloudinary package use korbo. Jar maddhome amader nijer project a oi image ke save na kore, coludinary er storate a save korbe. Then coludinary te host kore req.file er moddhe sei image er link ke set kore diba.

cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
});

export const cloudinaryUpload = cloudinary;
