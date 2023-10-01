import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/user.routes";
import connectToDatabase from "./config/mongoose.config";
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/views", express.static("views"));
app.use(morgan("dev"));
app.use(cors());

require("dotenv").config();

connectToDatabase();

// Routes:
/* app.use("/", (req: Request, res: Response) => {
  res.sendFile("views/index.html", { root: __dirname });
}); */
app.use("/api/auth", authRoutes);

export default app;