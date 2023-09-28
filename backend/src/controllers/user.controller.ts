import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";

class UserController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });

      if (!user) return res.json({ msg: "Incorrect Username or Password", status: false });
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return res.json({ msg: "Incorrect Username or Password", status: false });

      return res.json({
        status: true,
        user: {
          _id: user._id,
          username: user.username,
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
      const { username, email, password } = req.body;

      const usernameCheck = await User.findOne({ username });
      if (usernameCheck) return res.json({ msg: "Username already used", status: false });

      const emailCheck = await User.findOne({ email });
      if (emailCheck) return res.json({ msg: "Email already used", status: false });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        email,
        username,
        password: hashedPassword,
      });

      return res.json({
        status: true,
        user: {
          _id: user._id,
          username: user.username,
          fullname: user.fullname,
          numberid: user.numberid,
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
