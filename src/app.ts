import cors from "cors";
import express from "express";
import { UserRoutes } from "./app/modules/user/user.route";

const app = express();

app.use(express.json());
app.use(cors());

//API Routes call
app.use("/api/v1/user", UserRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Backend PH Tour Management App!!",
  });
});
export default app;
