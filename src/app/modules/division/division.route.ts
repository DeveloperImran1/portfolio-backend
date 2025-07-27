import { Router } from "express";
import { multerUpload } from "../../../config/multer.config";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { DivisionController } from "./division.controller";
import {
  createDivisionZodSchema,
  updateDivisionZodSchema,
} from "./division.validation";

const router = Router();

router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  // jei jei api a image file asbe, sei route gulote  checkAuth er niche multerUpload.sing("file") ai middleware ta use korte hobe. Jar maddhome body te asa image er file and body ke 2 ta vage vag kore felbe. req.file er moddhe image er file thakbe. Ar req.body er moddhe other data gulo thakbe.
  // Ar aikhane .single("file") --> file name dewar karon holo: fron-end ba postman theke jokhon form-data er moddhe theke data send korbo. Tokhon data property er moddhe amader normal body te jei data gulo send korteam seigulo pathabo. Ar image er file ke send korbo ai file namer property er moddhe.
  multerUpload.single("file"),
  validateRequest(createDivisionZodSchema),
  DivisionController.createDivision
);

router.get(
  "/",
  checkAuth(...Object.values(Role)),
  DivisionController.getAllDivision
);

router.get(
  "/:slug",
  checkAuth(...Object.values(Role)),
  DivisionController.getSingleDivision
);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(updateDivisionZodSchema),
  DivisionController.updateDivision
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DivisionController.deleteDivision
);

export const DivisionRoutes = router;
