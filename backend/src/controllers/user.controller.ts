import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";

class UserController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      console.log(req.body)
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(401).json({ error: "Unauthorized", message: "Incorrect Username or Password" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Unauthorized", message: "Incorrect Username or Password" });
      }

      return res.json({
        status: true,
        user: {
          _id: user._id,
          fullname: user.fullname,
          studentId: user.studentId,
          email: user.email,
          avatar: user.avatar
        },
      });
    } catch (ex) {
      next(ex);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullname, studentId, avatar, email, password } = req.body;
      console.log(req.body)
      const emailCheck = await User.findOne({ email });
      if (emailCheck) return res.status(400).json({ error: "Bad Request", message: "Email already used" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        email,
        fullname,
        studentId,
        avatar,
        password: hashedPassword,
      });

      return res.json({
        status: true,
        user: {
          _id: user._id,
          fullname: user.fullname,
          studentId: user.studentId,
          email: user.email,
          avatar: user.avatar
        },
      });
    } catch (ex) {
      next(ex);
    }
  }

  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.find({ _id: { $ne: req.params.id } }).select([
        "email",
        "username",
        "avatar",
        "_id",
      ]);

      return res.json(users);
    } catch (ex) {
      next(ex);
    }
  }

  static logOut(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) {
        return res.json({ msg: "User id is required " });
      }

      return res.status(200).send({ status: true });
    } catch (ex) {
      next(ex);
    }
  }
}

export default UserController;
