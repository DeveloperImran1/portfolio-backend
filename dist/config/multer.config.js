"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerUpload = void 0;
/* eslint-disable no-useless-escape */
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_config_1 = require("./cloudinary.config");
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_config_1.cloudinaryUpload,
    params: {
        // aikhane public id holo cloudinary te jei name a image ta save hobe sei name. Aita mustbe unique hote hobe. Tai public_id value hisabe akta callback function nei. Sei function er moddhe image er file name er sathe aro bivinno kiso charecter add kore uniqe kore return koresi.
        public_id: (req, file) => {
            // let my image name is => My Special.Image#!@.png => ai image name take use kore airokom vabe uiniqe korbo => 4545adsfsadf-45324263452-my-image.png
            const fileName = file.originalname
                .toLowerCase()
                .replace(/\s+/g, "-") // empty space  replace with dash
                .replace(/\./g, "-") // dot replace with dash
                .replace(/[^a-z0-9\-\.]/g, ""); //  alpha numeric ke remove kortesi - !@#$
            const extension = file.originalname.split(".").pop();
            // binary bolte bujhai -> 0,1
            // hexa decimal bolte bujhai  -> 0-9 A-F
            // base 36  bolte bujhai -> 0-9 a-z
            // 0.2312345121 ai number ke toString(36) korle airkom hobe. -> "0.hedfa674338sasfamx" ai string ke subString(2) korle 1st 2ta element bade tarpor last porjonto element gulo niba -> 452384772534
            const uniqueFileName = Math.random().toString(36).substring(2) +
                "-" +
                Date.now() +
                "-" +
                fileName +
                "." +
                extension;
            return uniqueFileName;
        },
    },
});
exports.multerUpload = (0, multer_1.default)({ storage: storage });
