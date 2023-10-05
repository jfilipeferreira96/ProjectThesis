import { Router } from "express";
import path from "path";
import authRoutes from "./user.routes";
import challengeRoutes from "./challenge.routes";
const routes = Router();


/***************** PUBLIC ROUTES *****************/
routes.get("/api", (req, res) => {
  const rootPath = path.resolve(__dirname, "..", "views");
  res.sendFile("/index.html", { root: rootPath });
});

/***************** AUTH ROUTES *****************/
routes.use("/api/auth", authRoutes); 
routes.use("/api/challenge", challengeRoutes); 


export default routes;
