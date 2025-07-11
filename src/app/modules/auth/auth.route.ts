import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const route = Router();

route.post("/login", AuthControllers.loginUser);

export const AuthRoutes = route;
