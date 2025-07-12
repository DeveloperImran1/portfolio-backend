import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { Role } from "./user.interface";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
const router = Router();

// Client side theke kono request asle, seita app.ts > index.ts > user.route.ts file a ase. Then user.controller.ts file a jai. So userController file a jaower age amra zod validation korbo. Zod er rule onujai match na korle controller a jate dibona.

// [NOTE: zod ke validate korte hobe sudho post and update korar somoi. Karon req.body te sudho post and update method ai data ase.]

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);

router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllUser
);

// api hobe: api/v1/user/:id
router.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser
); // ...Object.values(Role) --> mane "USER", "GUIDE", "ADMIN", "SUPER_ADMIN"

export const UserRoutes = router;
