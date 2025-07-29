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
/* eslint-disable @typescript-eslint/no-explicit-any */
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_local_1 = require("passport-local");
const user_interface_1 = require("../app/modules/user/user.interface");
const user_model_1 = require("../app/modules/user/user.model");
const env_1 = require("./env");
// For credentials login with passport --> auth.services.ts file er credentialsLogin function er kajgulo passport dia kortesi.
passport_1.default.use(new passport_local_1.Strategy({
    // aikhena passport er moddhe email ta userNameField namer property te ase. So amra usernameField ke name alias kore email kore diasi. Similarly password ta passwordField er moddhe asto. Jeita password name dia alias koreci. So 2nd perameter er function a, amar alias kora name dia oi property gulo ke pabo.
    usernameField: "email",
    passwordField: "password",
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isUserExist = yield user_model_1.User.findOne({ email });
        if (!isUserExist) {
            return done(null, false, { message: "User not exist" });
        }
        // user verified, block or inactive hole or deleted hole error throw korbo.
        if (!isUserExist.isVerified) {
            return done("User is not verified");
        }
        if (isUserExist.isActive === user_interface_1.IsActive.BLOCK ||
            isUserExist.isActive === user_interface_1.IsActive.INACTIVE) {
            return done(`User is ${isUserExist.isActive}`);
        }
        if (isUserExist.isDeleted === true) {
            return done("User is Deleted");
        }
        // google dia login thakle, return kore dibo akta message. karon se google dia login. But chasse credentials dia login korte. Aikhane some() method check kore kono object er moddhe provider er value google naki. google holei true return korbe.
        const isGoogleAuthenticated = isUserExist.auths.some((providerObj) => providerObj.provider == "google");
        // aikhane check koreci, user google dia login korece kina and userObject er moddhe password property ase kina. Tar mane google dia login korese, but jodi updateProfile page theke password set kore. Tahole error throw na kore, niche gia password match korbe.
        if (isGoogleAuthenticated && !(isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.password)) {
            return done(null, false, {
                message: "You are authenticated throw Google. So if you want to login with credentials, then you first login with google and set password for your Gmail in update profile page. Then you can login with email and password",
            });
        }
        const isPasswordMatched = yield bcryptjs_1.default.compare(password, isUserExist.password);
        if (!isPasswordMatched) {
            return done(null, false, { message: "Password not matched" });
        }
        return done(null, isUserExist);
    }
    catch (error) {
        console.log(error);
        done(error); // done method ta error ke throw korte pare. abar result oo return korte pare. so next() ba throw new AppError() ke use korte hoina.
    }
})));
// For google signup or signin
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: envVars.GOOGLE_CLIENT_ID,
//       clientSecret: envVars.GOOGLE_CLIENT_SECRET,
//       callbackURL: envVars.GOOGLE_CALLBACK_URL,
//     },
//     async (
//       accessToken: string,
//       refreshToken: string,
//       profile: Profile,
//       done: VerifyCallback // profile and done er type gulo passport-google-oauth20 theke import korte hobe.
//     ) => {
//       try {
//         const email = profile?.emails?.[0]?.value;
//         if (!email) {
//           return done(null, false, { message: "Email not found" });
//         }
//         let user = await User.findOne({ email });
//         // ai email er user db te na thakle user create korte hobe db te
//         if (!user) {
//           user = await User.create({
//             email,
//             name: profile?.displayName,
//             picture: profile?.photos?.[0]?.value,
//             role: Role.USER,
//             isVerified: true,
//             auths: [
//               {
//                 provider: "google",
//                 providerId: profile.id,
//               },
//             ],
//           });
//           // DB te user create hoia gele, done fulction ke call korbo. 1st perameter a error hole error ke dita hobe, otherwise null dibo. 2nd perameter a user er value ta dibo.
//           return done(null, user);
//         }
//       } catch (error) {
//         console.log("Google strategy error", error);
//         return done(error);
//       }
//     }
//   )
// );
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_1.envVars.GOOGLE_CLIENT_ID,
    clientSecret: env_1.envVars.GOOGLE_CLIENT_SECRET,
    callbackURL: env_1.envVars.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done // profile and done er type gulo passport-google-oauth20 theke import korte hobe.
) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const email = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
        if (!email) {
            return done(null, false, { mesaage: "No email found" });
        }
        let isUserExist = yield user_model_1.User.findOne({ email });
        if (isUserExist && !isUserExist.isVerified) {
            // throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
            // done("User is not verified")
            return done(null, false, { message: "User is not verified" });
        }
        if (isUserExist &&
            (isUserExist.isActive === user_interface_1.IsActive.BLOCK ||
                isUserExist.isActive === user_interface_1.IsActive.INACTIVE)) {
            // throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
            done(`User is ${isUserExist.isActive}`);
        }
        if (isUserExist && isUserExist.isDeleted) {
            return done(null, false, { message: "User is deleted" });
            // done("User is deleted")
        }
        if (!isUserExist) {
            isUserExist = yield user_model_1.User.create({
                email,
                name: profile.displayName,
                picture: (_b = profile.photos) === null || _b === void 0 ? void 0 : _b[0].value,
                role: user_interface_1.Role.USER,
                isVerified: true,
                auths: [
                    {
                        provider: "google",
                        providerId: profile.id,
                    },
                ],
            });
        }
        return done(null, isUserExist);
    }
    catch (error) {
        console.log("Google Strategy Error", error);
        return done(error);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user === null || user === void 0 ? void 0 : user._id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(id);
        done(null, user);
    }
    catch (error) {
        console.log(error);
        done(error);
    }
}));
