import express from "express";
import { Router } from "express";
import UserController from "../controllers/user.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const authRoutes: Router = express.Router();

// Rota responsável por Criar um novo 'User': (POST): localhost:5000/api/auth/register
authRoutes.post("/register", UserController.register);

// Rota responsável por realizar um novo login 'User': (POST): localhost:5000/api/auth/login
authRoutes.post("/login", UserController.login);

// Rota responsável por retornar todos os users: (GET): localhost:5000/api/auth/allusers
authRoutes.get("/allusers/:id", authenticateToken, UserController.getAllUsers);


export default authRoutes;
