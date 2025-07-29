"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DivisionRoutes = void 0;
const express_1 = require("express");
const multer_config_1 = require("../../../config/multer.config");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_interface_1 = require("../user/user.interface");
const division_controller_1 = require("./division.controller");
const division_validation_1 = require("./division.validation");
const router = (0, express_1.Router)();
router.post("/create", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), 
// jei jei api a image file asbe, sei route gulote  checkAuth er niche multerUpload.sing("file") ai middleware ta use korte hobe. Jar maddhome body te asa image er file and body ke 2 ta vage vag kore felbe. req.file er moddhe image er file thakbe. Ar req.body er moddhe other data gulo thakbe.
// Ar aikhane .single("file") --> file name dewar karon holo: fron-end ba postman theke jokhon form-data er moddhe theke data send korbo. Tokhon data property er moddhe amader normal body te jei data gulo send korteam seigulo pathabo. Ar image er file ke send korbo ai file namer property er moddhe.
multer_config_1.multerUpload.single("file"), (0, validateRequest_1.validateRequest)(division_validation_1.createDivisionZodSchema), division_controller_1.DivisionController.createDivision);
router.get("/", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), division_controller_1.DivisionController.getAllDivision);
router.get("/:slug", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), division_controller_1.DivisionController.getSingleDivision);
router.patch("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), multer_config_1.multerUpload.single("file"), (0, validateRequest_1.validateRequest)(division_validation_1.updateDivisionZodSchema), division_controller_1.DivisionController.updateDivision);
router.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), division_controller_1.DivisionController.deleteDivision);
exports.DivisionRoutes = router;
