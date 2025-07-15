import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import expressSession from "express-session";
import passport from "passport";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { router } from "./app/routes";
import { envVars } from "./config/env";
import "./config/passport";

const app = express();

app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use(express.json());
app.use(cors());

//API Routes call
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Backend PH Tour Management App!!",
  });
});

// Global error handler
app.use(globalErrorHandler);

// Route not founde handle
app.use(notFound);

export default app;
