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
exports.AuthRoutes = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const env_1 = require("../../../config/env");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
router.post("/login", auth_controller_1.AuthControllers.credentialsLogin);
router.post("/refresh-token", auth_controller_1.AuthControllers.getNewAccessToken);
router.post("/logout", auth_controller_1.AuthControllers.logout);
// jodi google dia login kore thake, and password already set kore thake. Tahole ai api error throw korbe. Karon aita password reset korar jonno noi. Sudho jei user ra google dia login korese. Tara credential login system available korte chai. Tader jonno 1st time akbar password set korar system aita.
router.post("/set-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), auth_controller_1.AuthControllers.setPassword);
// Forget password korar roadmap holo:
// => Frontend theke jekono user tar existing email dia "/forgot-password" route a hit korbe. Ai rouote ta public hote hobe. checkAuth() middleware use kora jabena. Karon unauthenticated user rai ai route a hit korbe.
// => Tarpor backend a sei email dia DB te check korbo oi user exist kore kina ba Active silo kina etc.
// => Tarpor short time(10 min er) akta expiration token generate korbo, Sei link ta user er dewa email er throw te Akta front-end er link akare send korbo.
// Akhon user tar email theke oi linkup button a click korle new password dewer page a nia jabe. Email a sent kora link ta hobe airokom: http://localhost:5173/reset-password?email=ih9066588@gmail.com&token=backend a created kora toekn.  ==> Tarpor ai route a gia user theke new password nia jokhon submit button a click korbe, tokho ai url theke email, new password, token nia backend er "/reset-password" api a hit kore dibo. token ta headers er Authorization a set kore hit korbe.
// ===> backend a token verify kore, password hased kore DB te save kore dibo. Thats mean forgot-password er jonno 2ta api use hosse.
router.post("/forgot-password", auth_controller_1.AuthControllers.forgotPassword);
// Jeheto akjon login kora user ee sudho ai route a request korte parbe ba password reset korte parbe. Tai checkAuth dia sei user authinticate naki ta check korte hobe. Ar perameter a all role diasi. Tar mane sokol role er user ra ai route a request korte pabe. But sudho login thakte hobe. Jeheto forget password er somoi email pathabo user er kase. Tokhon Akta token pathabo. Jei token Un authenticate user new password set korar jonno sei token headers er moddhe set kore ai /rest-password route a hit korte parbe.
router.post("/reset-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), 
// Aitar jonno zod validation korte hobe.
auth_controller_1.AuthControllers.resetPassword);
// Normaly login kora kono user profile update korar jonno, ager password dia  new password set korte parbe.
router.post("/change-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), auth_controller_1.AuthControllers.changePassword);
//  client side theke google dia login korar somoi, kono data pathate hobena, tai get route use kortesi. Tarpor 2nd perameter theke passport.authinticate ke call korese, jar fole config > passport.ts file exicute hobe. and google dia login hoia akta user create korbe. tarport /google/callback rout e requst korbe automatically.
router.get("/google", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Let user booking route a hit korte gesilo --> login a pathia disa --> login hower por sei bookin route a redirect korbo.
    const redirect = req.query.redirect || "/";
    passport_1.default.authenticate("google", {
        scope: ["profile", "email"],
        state: redirect, // aikhane state er value hisabe redirect ke set kore dewai. Login success hoia jei callback api te hit korbe. Seikhane state namer query te redirect er path ta pabo.
    })(req, res);
}));
// google dia login hower por, callback er api te hit korbe, so create kortesi. Ai api er moddhe jwt token, cookie etc create korbo and set korbo.
router.get("/google/callback", passport_1.default.authenticate("google", {
    failureRedirect: `${env_1.envVars.FRONTEND_URL}/login?error=This is some issue with your account. Please contact our support team.`,
}), // Aikhane passport ta middleware hisabe use hosse. Ai middleware ke ami kinto call deini. Karon middleware ke call dewer kaj express kore thakbe. But uporer /google route a middleware er moddhe akta function ase. Tai expressJs middleware ke call korese. But oi middleware ba function er moddhe jodi aro akta function thake, seitake to express call korbena. Aijonnoi passport.authenticate()(req, res) aivabe call koresi.
auth_controller_1.AuthControllers.googleCallbackcontroller);
exports.AuthRoutes = router;
