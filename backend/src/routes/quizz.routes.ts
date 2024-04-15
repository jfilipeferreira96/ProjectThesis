import express from "express";
import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import QuizzController from "../controllers/quizz.controller";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const quizzRoutes: Router = express.Router();

quizzRoutes.post("/quizz/create", authenticateToken, QuizzController.AddQuizz);

quizzRoutes.get("/quizz/:id", authenticateToken, QuizzController.GetSingleQuizz);

quizzRoutes.post("/quizz/delete", authenticateToken, QuizzController.DeleteQuizz);

quizzRoutes.post("/quizz/edit", authenticateToken, QuizzController.EditQuizz);

quizzRoutes.post("/quizz/editStatus", authenticateToken, QuizzController.EditQuizStatus);

quizzRoutes.post("/quizz/answer", authenticateToken, upload.array("files"), QuizzController.SaveQuizAnswer);

export default quizzRoutes;
