import express from "express";
import cors from "cors";
import morgan from "morgan";
//import mongooseConnection from "./config/mongoose.config";
import { Request, Response } from "express";
const app = express();
import authRoutes from "./routes/user.routes";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/views", express.static("views"));
app.use(morgan("dev"));
app.use(cors());

require("dotenv").config();

//app.set("mongoose connection", mongooseConnection);

// Routes:
app.use("/api", (req: Request, res: Response) => {
  res.sendFile("views/index.html", { root: __dirname });
});
app.use("/api/auth", authRoutes);

export default app;