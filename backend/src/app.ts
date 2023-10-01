import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/user.routes";
import connectToDatabase from "./config/mongoose.config";
import routes from "./routes/routes";
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/views", express.static("views"));
app.use(morgan("dev"));

const corsOptions = {
  origin: ["http://localhost:3000", "http://meu-site2.com"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));


require("dotenv").config();

connectToDatabase();

// Routes:
/* app.use("/", (req: Request, res: Response) => {
  res.sendFile("views/index.html", { root: __dirname });
}); */
//app.use("/api/auth", authRoutes);
app.use(routes);

export default app;