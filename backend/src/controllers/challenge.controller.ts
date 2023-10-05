import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import Challenge from "../models/challenge.model";


class ChallengeController {
  static async CreateChallenge(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, type } = req.body;
      const user = req.user;

      const challenge = await Challenge.create({
        title,
        description,
        type,
        admins: [user._id],
      });

      return res.status(200).json({
        status: true,
        id: challenge._id,
      });
    } catch (ex) {
      next(ex);
    }
  }

  static async GetChallengesByUserId(req: Request, res: Response, next: NextFunction) {
    console.log('entrei aqui fdgps')
    try {
      const user = req.user;
      console.log('entrei')
      const challenges = await Challenge.find({
        $or: [{ admins: user._id }, { participants: user._id }],
      }).exec();
      console.log('ok')
      console.log(challenges);
      return res.status(200).json({
        status: true,
        challenges: challenges,
      });
    } catch (error) {
      throw new Error("Error fetching challenges: " + error);
    }
  }

  static async GetSingleChallenge(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const id = req.params.id;

      const challenge = await Challenge.findOne({ _id: id });

      console.log(challenge);
      return res.status(200).json({
        status: true,
        challenge: challenge,
      });
    } catch (error) {
      throw new Error("Error fetching challenges: " + error);
    }
  }
}

export default ChallengeController;
