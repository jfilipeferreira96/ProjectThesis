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
          avatarImage: user.avatarImage,
          isAvatarImageSet: user.isAvatarImageSet,
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
          email: user.email,
          avatarImage: user.avatarImage,
          isAvatarImageSet: user.isAvatarImageSet,
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
        "avatarImage",
        "_id",
      ]);

      return res.json(users);
    } catch (ex) {
      next(ex);
    }
  }

  static async setAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const avatarImage = req.body.image;

      const userData = await User.findByIdAndUpdate(
        userId,
        { isAvatarImageSet: true, avatarImage },
        { new: true }
      );

      if (!userData) {
        return res.status(404).json({ msg: "User not found" });
      }

      return res.json({
        isSet: userData.isAvatarImageSet,
        image: userData.avatarImage,
      });
    } catch (ex) {
      next(ex);
    }
  }

  static logOut(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) {
        return res.json({ msg: "User id is required " });
      }

      // Note que 'onlineUsers' ainda não está definido, você deve substituir isso pela sua lógica real.
      // onlineUsers.delete(req.params.id);

      return res.status(200).send({ status: true });
    } catch (ex) {
      next(ex);
    }
  }
}

export default UserController;
