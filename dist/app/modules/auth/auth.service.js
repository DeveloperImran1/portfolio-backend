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
exports.AuthServices = void 0;
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const sendEmail_1 = require("../../utils/sendEmail");
const userTokens_1 = require("../../utils/userTokens");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
// credentialsLogin er moddher all kaj passport.ts file er moddhe kora hoiase. Because google login kora user der ke condition dia lagin er kaj korasse.
// const credentialsLogin = async (payload: Partial<IUser>) => {
//   const { email, password } = payload;
//   const isUserExist = await User.findOne({ email });
//   if (!isUserExist) {
//     throw new AppError(httpStatus.BAD_REQUEST, "User not found");
//   }
//   const isPasswordMatched = await bcrypt.compare(
//     password as string,
//     isUserExist.password as string
//   );
//   if (!isPasswordMatched) {
//     throw new AppError(httpStatus.BAD_GATEWAY, "Invalid Password");
//   }
//   //  token create
//   const userToken = createUserTokens(isUserExist);
//   // isUserExist er moddhe user er all data ase. But password front-end a send na korai better. Tai isUserExist theke password property ke delete korbo.
//   const { password: pass, ...rest } = isUserExist.toObject();
//   // user login korar pore ai object ta front-end a jabe. ai token gulo nia cookie te set kora rakhte  hobe.
//   return {
//     accessToken: userToken.accessToken,
//     refreshToken: userToken.refreshToken,
//     user: rest,
//   };
// };
// new token generate using refresh token
const getNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    // refresh token dia new akta token create korar kaj ta utils > userTokens.ts file er moddhe akta function a koreci.
    const accessToken = yield (0, userTokens_1.createNewAccessTokenWithRefreshToken)(refreshToken);
    return {
        accessToken,
    };
});
const resetPassword = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.id != decodedToken.userId) {
        throw new AppError_1.default(401, "You can not reset your password");
    }
    const isUserExist = yield user_model_1.User.findById(decodedToken.userId);
    if (!isUserExist) {
        throw new AppError_1.default(401, "User does not exist");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(payload.newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    isUserExist.password = hashedPassword;
    yield isUserExist.save();
});
const setPassword = (userId, plainPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    // jodi google dia login kore thake, and password already set kore thake. Tahole ai api error throw korbe. Karon aita password reset korar jonno noi. Sudho jei user ra google dia login korese. Tara credential login system available korte chai. Tader jonno 1st time akbar password set korar system aita.
    if (user.password &&
        user.auths.some((authObject) => authObject.provider == "google")) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You have already set your password. Now you can change your password from your profile password update page.");
    }
    // aikhane user.auth.some()  -> method dara mean kore, er moddhe jei function ase. Sei function er kono conditaion match korlei output true return korbe.
    if (user.auths.some((authObject) => authObject.provider == "credentials")) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are loged in with credential. So you can reset your password. You cannot set password.");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(plainPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    user.password = hashedPassword;
    const credentialProvider = {
        provider: "credentials",
        providerId: user.email,
    };
    const auths = [...user.auths, credentialProvider];
    user.auths = auths;
    yield user.save();
});
const changePassword = (oldPassword, newPassword, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(decodedToken.userId);
    const isOldPasswordMatch = yield bcryptjs_1.default.compare(oldPassword, user === null || user === void 0 ? void 0 : user.password);
    if (!isOldPasswordMatch) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Your old password not matched!");
    }
    // aikhane user null hobena, aita bujhar jonno not null assertion symbol (!) use koreci. ar hash kora password ke user.password er moddhe bose, save() kore diasi.
    user.password = yield bcryptjs_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    user.save();
});
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({ email: email });
    console.log("forgot password a ", isUserExist);
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User not found");
    }
    // user verified, block or inactive hole or deleted hole error throw korbo.
    if (!isUserExist.isVerified) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is not verified");
    }
    if (isUserExist.isActive === user_interface_1.IsActive.BLOCK ||
        isUserExist.isActive === user_interface_1.IsActive.INACTIVE) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `User is ${isUserExist.isActive}`);
    }
    if (isUserExist.isDeleted === true) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is Deleted");
    }
    const JwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role,
    };
    // createUserTokens.ts name a akta utility function ase amader. Jeita use kore jwtToken create korte partam. But ai resetToken er expired time maximum 10 minute hobe. Tai extravabe create kortesi.
    const resetToken = yield jsonwebtoken_1.default.sign(JwtPayload, env_1.envVars.JWT_ACCESS_SECRET, {
        expiresIn: "10m",
    });
    const resetUILink = `${env_1.envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;
    (0, sendEmail_1.sendEmail)({
        to: isUserExist.email,
        subject: "Password Reset",
        templateName: "forgetPassword",
        templateData: {
            // forgetpassword.ejs file a dynamic vabe jei jei variable gul use koreci.Sei variable gulo aikhane templateDatar moddhe pathate hobe.
            name: isUserExist.name,
            resetUILink,
        },
    });
    // Email a send howa link: http://localhost:5173/reset-password?id=688688ef5fd418af113f0d99&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODg2ODhlZjVmZDQxOGFmMTEzZjBkOTkiLCJlbWFpbCI6ImRldmVsb3BlcmltcmFuMTEyMkBnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc1MzY0NzM2OSwiZXhwIjoxNzUzNjQ3OTY5fQ.hN14hX1yJUXmWzdG44wv3NVzDT0jY3vpUE-3Tgbvdz4
    // Aikhan theke id er value and token er value dia newPassword set korar jonno reset-password route a hit korbo.
});
exports.AuthServices = {
    // credentialsLogin,
    getNewAccessToken,
    resetPassword,
    changePassword,
    setPassword,
    forgotPassword,
};
