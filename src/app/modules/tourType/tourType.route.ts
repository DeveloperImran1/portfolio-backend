import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { TourTypeController } from "./tourType.controller";
import {
  createTourTypeZodSchema,
  updateTourTypeZodSchema,
} from "./tourType.validation";

const router = Router();

router.post(
  "/create-tour-type",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourTypeZodSchema),
  TourTypeController.createTourType
);

router.get(
  "/tour-types",
  checkAuth(...Object.values(Role)),
  TourTypeController.getAllTourType
);

router.get(
  "/tour-types/:id",
  checkAuth(...Object.values(Role)),
  TourTypeController.getSingleTourType
);

router.patch(
  "/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateTourTypeZodSchema),
  TourTypeController.updateTourType
);

router.delete(
  "/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourTypeController.deleteTourType
);

export const TourTypeRoutes = router;
