"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourRoutes = void 0;
const express_1 = require("express");
const multer_config_1 = require("../../../config/multer.config");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_interface_1 = require("../user/user.interface");
const tour_controller_1 = require("./tour.controller");
const tour_validation_1 = require("./tour.validation");
const router = (0, express_1.Router)();
router.post("/create", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.array("files"), // Multiple image er jonno 'files' name use korbo. Karon postman theke photor array ta files property er moddhe send korbo.
(0, validateRequest_1.validateRequest)(tour_validation_1.createTourZodSchema), tour_controller_1.TourController.createTour);
router.get("/", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), tour_controller_1.TourController.getAllTour);
router.get("/:slug", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), tour_controller_1.TourController.getSingleTour);
router.patch("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.array("files"), (0, validateRequest_1.validateRequest)(tour_validation_1.updateTourZodSchema), tour_controller_1.TourController.updateTour);
router.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), tour_controller_1.TourController.deleteTour);
exports.TourRoutes = router;
