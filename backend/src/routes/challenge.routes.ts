import express from "express";
import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import ChallengeController from "../controllers/challenge.controller";

const challengeRoutes: Router = express.Router();

// Rota responsável por Criar um novo 'User': (POST): localhost:5000/api/challenge/create
challengeRoutes.post("/create", authenticateToken, ChallengeController.CreateChallenge);



export default challengeRoutes;
