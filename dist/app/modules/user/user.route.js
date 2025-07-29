"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_controller_1 = require("./user.controller");
const user_interface_1 = require("./user.interface");
const user_validation_1 = require("./user.validation");
const router = (0, express_1.Router)();
// Client side theke kono request asle, seita app.ts > index.ts > user.route.ts file a ase. Then user.controller.ts file a jai. So userController file a jaower age amra zod validation korbo. Zod er rule onujai match na korle controller a jate dibona.
// [NOTE: zod ke validate korte hobe sudho post and update korar somoi. Karon req.body te sudho post and update method ai data ase.]
// [NOTE: Remember routing korar somoi dynamic route, i mean jei route gulo /:id airokom dynamic route gulo ke sobar last a set korte hobe. Karon /: aikhane jekono kiso hote pare. So jodi top a ai dynamic route likhi, tahole hoardcoded porjonto jabena. So Top a hardcotate route then bottom a dynamic route set korte hobe]
router.post("/register", (0, validateRequest_1.validateRequest)(user_validation_1.createUserZodSchema), user_controller_1.UserControllers.createUser);
router.get("/all-users", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.UserControllers.getAllUser);
// Jekono user ai router er maddhome tar nijer dota get korte parbe.
router.get("/me", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.UserControllers.getMe);
// akjon user ke onno user get korte parbena. sudho admin and super-admin get korte parbe.
router.get("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.UserControllers.getSingleUser);
// api hobe: api/v1/user/:id
router.patch("/:id", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), // aikhane age authentication-authorization checking er middleware use korte hobe., Then zod schema validate kora right way.
(0, validateRequest_1.validateRequest)(user_validation_1.updateUserZodSchema), user_controller_1.UserControllers.updateUser); // ...Object.values(Role) --> mane "USER", "GUIDE", "ADMIN", "SUPER_ADMIN"
exports.UserRoutes = router;
