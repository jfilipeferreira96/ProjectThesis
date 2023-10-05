import { Request, Response, NextFunction } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import UserController, { User } from "../controllers/user.controller";

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header("Authorization");

  if (!authHeader) return res.sendStatus(401); // Unauthorized

  const token = authHeader.split(" ")[1]; // Remover "Bearer " do token
  
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ error: "JWT_SECRET não está definido no ambiente." });
  }

  jwt.verify(token, secret, (err: VerifyErrors | null, user: any) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    if (user) {
      req.user = user;
      next();
    } else {
      return res.sendStatus(403); // Forbidden
    }
  });
}

export function refreshToken(req: Request, res: Response) {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) return res.sendStatus(401); // Unauthorized

  const refreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!refreshSecret) {
    return res.status(500).json({ error: "JWT_REFRESH_SECRET não está definido no ambiente." });
  }

  jwt.verify(refreshToken, refreshSecret, (err: VerifyErrors | null, user: any) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    if (user) {
      const accessToken = UserController.generateAccessToken(user);
      res.json({ accessToken });
    } else {
      return res.sendStatus(403); // Forbidden
    }
  });
}
