import express from "express";
import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import ChallengeController from "../controllers/challenge.controller";

const challengeRoutes: Router = express.Router();

challengeRoutes.post("/challenges/create", authenticateToken, ChallengeController.CreateChallenge);

challengeRoutes.post("/challenges/edit", authenticateToken, ChallengeController.EditChallenge);

challengeRoutes.post("/challenges/admin/add", authenticateToken, ChallengeController.AddAdmin);

challengeRoutes.post("/challenges/admin/remove", authenticateToken, ChallengeController.RemoveAdmin);

challengeRoutes.get("/challenges", authenticateToken, ChallengeController.GetChallengesByUserId);

challengeRoutes.get("/challenges/:id", authenticateToken, ChallengeController.GetSingleChallenge);

challengeRoutes.post("/challenges/join", authenticateToken, ChallengeController.JoinChallenge);

challengeRoutes.get("/challenges/quizzes/:id", authenticateToken, ChallengeController.GetAllChallengeQuizzes);

export default challengeRoutes;
