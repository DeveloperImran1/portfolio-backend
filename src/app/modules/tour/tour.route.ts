import { Router } from "express";
import { multerUpload } from "../../../config/multer.config";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { TourController } from "./tour.controller";
import { createTourZodSchema, updateTourZodSchema } from "./tour.validation";

const router = Router();

router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.array("files"), // Multiple image er jonno 'files' name use korbo. Karon postman theke photor array ta files property er moddhe send korbo.
  validateRequest(createTourZodSchema),
  TourController.createTour
);
router.get("/", checkAuth(...Object.values(Role)), TourController.getAllTour);

router.get(
  "/:slug",
  checkAuth(...Object.values(Role)),
  TourController.getSingleTour
);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.array("files"),
  validateRequest(updateTourZodSchema),
  TourController.updateTour
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.deleteTour
);

export const TourRoutes = router;
