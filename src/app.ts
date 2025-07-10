import cors from "cors";
import express from "express";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { router } from "./app/modules/routes";

const app = express();

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
