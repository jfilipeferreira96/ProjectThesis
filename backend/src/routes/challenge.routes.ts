import express from "express";
import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import ChallengeController from "../controllers/challenge.controller";

const challengeRoutes: Router = express.Router();

challengeRoutes.post("/create", authenticateToken, ChallengeController.CreateChallenge);

challengeRoutes.get("/challenges", authenticateToken, ChallengeController.GetChallengesByUserId);

challengeRoutes.get("/challenge/:id", authenticateToken, ChallengeController.GetSingleChallenge);


export default challengeRoutes;
