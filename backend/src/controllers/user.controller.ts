import { Request, Response, NextFunction } from "express";
import User, { UserType } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Challenge from "../models/challenge.model";

export interface User {
  _id: string;
  fullname: string;
  studentId: string | number | undefined;
  email: string;
  avatar?: string;
  adminChallenges?: string[];
  type?: UserType;
  score?: number;
  badges?: any[];
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
        adminChallenges: formattedChallengeIds,
        type: user.type
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
          type: user.type,
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
      const { fullname, studentId, avatar, email, password, type } = req.body;

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
        type: type,
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
          type: user.type,
          adminChallenges: [],
        },
        accessToken,
        refreshToken,
      });
    } catch (ex) {
      console.error("Error during registration:", ex);
      return res.status(500).json({ error: "Internal Server Error", message: ex.message });
    }
  }

  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.find({ _id: { $ne: req.params.id } }).select(["email", "username", "avatar", "_id", "type"]);

      return res.status(200).json(users);
    } catch (ex) {
      throw new Error("An error occurred while fetching users.");
    }
  }

  static async updateOwnUser(req: Request, res: Response, next: NextFunction)
  {
    const userId = req.params.id;
    const { email, fullname, studentId, avatar, password } = req.body;

    try
    {
      // Verify if the user is trying to update their own profile
      if (req.user._id !== userId)
      {
        return res.status(403).json({ error: "Permission Denied", message: "You do not have permission to update this user" });
      }

      // Verify if at least one field was provided for update
      if (!email && !fullname && !studentId && !avatar && !password)
      {
        return res.status(400).json({ error: "Invalid Request", message: "No new data provided for update" });
      }

      // Check if the email is already in use by another user (if provided)
      if (email)
      {
        const existingUser = await User.findOne({ email, _id: { $ne: userId } });
        if (existingUser)
        {
          return res.status(409).json({ error: "Conflict", message: "The email is already in use by another user" });
        }
      }

      // Prepare fields for update
      const updateFields: any = {};

      if (email) updateFields.email = email;
      if (fullname) updateFields.fullname = fullname;
      if (studentId) updateFields.studentId = studentId;
      if (avatar) updateFields.avatar = avatar;
      if (password)
      {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateFields.password = hashedPassword;
      }

      // Execute the update if there are fields to update
      if (Object.keys(updateFields).length > 0)
      {
        const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true });

        if (updatedUser)
        {
          return res.status(200).json({ status: true, message: "Settings updated successfully", user: updatedUser });
        } else
        {
          return res.status(404).json({ error: "Not Found", message: "User not found" });
        }
      } else
      {
        return res.status(400).json({ error: "Invalid Request", message: "No new data provided for update" });
      }
    }
    catch (ex)
    {
      return res.status(500).json({ error: "Internal Server Error", message: ex.message });
    }
  }
}

export default UserController;
