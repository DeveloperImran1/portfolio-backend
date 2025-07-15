import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { AuthControllers } from "./auth.controller";

const router = Router();

router.post("/login", AuthControllers.credentialsLogin);
router.post("/refresh-token", AuthControllers.getNewAccessToken);
router.post("/logout", AuthControllers.logout);

// Jeheto akjon login kora user ee sudho ai route a request korte parbe ba password reset korte parbe. Tai checkAuth dia sei user authinticate naki ta check korte hobe. Ar perameter a all role diasi. Tar mane sokol role er user ra ai route a request korte pabe. But sudho login thakte hobe.
router.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  AuthControllers.resetPassword
);

//  client side theke google dia login korar somoi, kono data pathate hobena, tai get route use kortesi. Tarpor 2nd perameter theke passport.authinticate ke call korese, jar fole config > passport.ts file exicute hobe. and google dia login hoia akta user create korbe. tarport /google/callback rout e requst korbe automatically.
router.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    // Let user booking route a hit korte gesilo --> login a pathia disa --> login hower por sei bookin route a redirect korbo.
    const redirect = req.query.redirect || "/";
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string, // aikhane state er value hisabe redirect ke set kore dewai. Login success hoia jei callback api te hit korbe. Seikhane state namer query te redirect er path ta pabo.
    })(req, res);
  }
);

// google dia login hower por, callback er api te hit korbe, so create kortesi. Ai api er moddhe jwt token, cookie etc create korbo and set korbo.
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  AuthControllers.googleCallbackcontroller
);

export const AuthRoutes = router;
