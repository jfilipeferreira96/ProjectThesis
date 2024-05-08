import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/user.routes";
import connectToDatabase from "./config/mongoose.config";
import routes from "./routes/routes";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/views", express.static("views"));
app.use(morgan("dev"));

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001", "https://project-thesis-blond.vercel.app/"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cors(corsOptions));

require("dotenv").config();

connectToDatabase();

app.use(routes);

export default app;