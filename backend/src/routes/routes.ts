import { Router } from "express";
import path from "path";
import authRoutes from "./user.routes";
const routes = Router();


/***************** PUBLIC ROUTES *****************/
routes.get("/api", (req, res) => {
  const rootPath = path.resolve(__dirname, "..", "views");
  res.sendFile("/index.html", { root: rootPath });
});

/***************** AUTH ROUTES *****************/
routes.use("/api/auth", authRoutes); 


export default routes;
