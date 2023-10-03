import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

export interface User {
  _id: string;
  fullname: string;
  studentId: string | number | undefined;
  email: string;
  avatar: string;
}

interface RefreshToken {
  _id: string;
  email: string;
}

class UserController {
  static generateAccessToken(user: User) {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET não está definido no ambiente.");
    }

    return jwt.sign(user, secret, { expiresIn: "1h" });
  }

  static generateRefreshToken(user: RefreshToken) {
    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!refreshSecret) {
      throw new Error("JWT_REFRESH_SECRET não está definido no ambiente.");
    }

    return jwt.sign(user, refreshSecret, { expiresIn: "7d" });
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized", message: "Incorrect Email or Password" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized", message: "Incorrect Email or Password" });
      }

      const accessToken = UserController.generateAccessToken({
        _id: user._id,
        fullname: user.fullname,
        studentId: user.studentId,
        email: user.email,
        avatar: user.avatar,
      });

      const refreshToken = UserController.generateRefreshToken({
        _id: user._id,
        email: user.email,
      });

      return res.json({
        status: true,
        user: {
          _id: user._id,
          fullname: user.fullname,
          studentId: user.studentId,
          email: user.email,
          avatar: user.avatar,
        },
        accessToken,
        refreshToken,
      });
    } catch (ex) {
      next(ex);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullname, studentId, avatar, email, password } = req.body;
      
      const emailCheck = await User.findOne({ email });
      console.log(emailCheck);
      if (emailCheck) {
        console.log('entrei')
         return res.json({ error: "Bad Request", message: "Email already used" });
      }
       
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        email,
        fullname,
        studentId,
        avatar,
        password: hashedPassword,
      });

      const accessToken = UserController.generateAccessToken({
        _id: user._id,
        fullname: user.fullname,
        studentId: user.studentId,
        email: user.email,
        avatar: user.avatar,
      });

      const refreshToken = UserController.generateRefreshToken({
        _id: user._id,
        email: user.email,
      });
      
      return res.status(200).json({
        status: true,
        user: {
          _id: user._id,
          fullname: user.fullname,
          studentId: user.studentId,
          email: user.email,
          avatar: user.avatar,
        },
        accessToken,
        refreshToken,
      });
    } catch (ex) {
      next(ex);
    }
  }

  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.find({ _id: { $ne: req.params.id } }).select(["email", "username", "avatar", "_id"]);

      return res.status(200).json(users);
    } catch (ex) {
      next(ex);
    }
  }

  static logOut(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) {
        return res.json({ msg: "User id is required " });
      }

      return res.status(StatusCodes.OK).send({ status: true });
    } catch (ex) {
      next(ex);
    }
  }
}

export default UserController;
