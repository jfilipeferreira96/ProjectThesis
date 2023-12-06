import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import Challenge from "../models/challenge.model";

export interface User {
  _id: string;
  fullname: string;
  studentId: string | number | undefined;
  email: string;
  avatar?: string;
  adminChallenges?: string[];
}

interface RefreshToken {
  _id: string;
  email: string;
}

class UserController {
  static generateAccessToken(user: User) {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not defined in the environment.");
    }

    return jwt.sign(user, secret, { expiresIn: "1h" });
  }

  static generateRefreshToken(user: RefreshToken) {
    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!refreshSecret) {
      throw new Error("JWT_REFRESH_SECRET is not defined in the environment.");
    }

    return jwt.sign(user, refreshSecret, { expiresIn: "7d" });
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.json({ error: "Unauthorized", status: false, message: "Incorrect Email or Password" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.json({ error: "Unauthorized", status: false, message: "Incorrect Email or Password" });
      }

      const challengeIds = await Challenge.distinct("_id", { admins: user._id }).exec();
      const formattedChallengeIds = challengeIds.map((id) => id.toString());

      const accessToken = UserController.generateAccessToken({
        _id: user._id,
        fullname: user.fullname,
        studentId: user.studentId,
        email: user.email,
        adminChallenges: formattedChallengeIds
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
          adminChallenges: formattedChallengeIds,
        },
        accessToken,
        refreshToken,
      });
    } catch (ex) {
      throw new Error("An error occurred during login.");
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullname, studentId, avatar, email, password } = req.body;

      const emailCheck = await User.findOne({ email });

      if (emailCheck) {
        return res.status(200).json({ error: "Bad Request", message: "Email already used" });
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
        adminChallenges:[]
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
          adminChallenges: [],
        },
        accessToken,
        refreshToken,
      });
    } catch (ex) {
      throw new Error("An error occurred during registration.");
    }
  }

  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.find({ _id: { $ne: req.params.id } }).select(["email", "username", "avatar", "_id"]);

      return res.status(200).json(users);
    } catch (ex) {
      throw new Error("An error occurred while fetching users.");
    }
  }
}

export default UserController;
