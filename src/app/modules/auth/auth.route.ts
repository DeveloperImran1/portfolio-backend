import { Router } from "express";
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

export const AuthRoutes = router;
