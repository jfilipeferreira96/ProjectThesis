import express from "express";
import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import QuizzController from "../controllers/quizz.controller";

const quizzRoutes: Router = express.Router();

quizzRoutes.post("/quizz/create", authenticateToken, QuizzController.AddQuizz);

quizzRoutes.get("/quizz/:id", authenticateToken, QuizzController.GetSingleQuizz);

quizzRoutes.delete("/quizz/:id", authenticateToken, QuizzController.DeleteQuizz);

quizzRoutes.post("/quizzs/edit", authenticateToken, QuizzController.EditQuizz);


export default quizzRoutes;
