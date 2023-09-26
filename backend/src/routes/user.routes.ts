import express from "express";
import { Router } from "express";
import UserController from "../controllers/user.controller";

const router: Router = express.Router();

// Rota responsável por Criar um novo 'User': (POST): localhost:5000/api/auth/register
router.post("/register", UserController.register);

// Rota responsável por realizar um novo login 'User': (POST): localhost:5000/api/auth/login
router.post("/login", UserController.login);

// Rota responsável por retornar todos os users: (GET): localhost:5000/api/auth/allusers
router.get("/allusers/:id", UserController.getAllUsers);

// Rota responsável por colocar imagem no perfil: (POST): localhost:5000/api/auth/setavatar/:id
router.post("/setavatar/:id", UserController.setAvatar);

// Rota responsável por retornar fazer logout 'User': (GET): localhost:5000/api/auth/logout/:id
router.get("/logout/:id", UserController.logOut);

export default router;
