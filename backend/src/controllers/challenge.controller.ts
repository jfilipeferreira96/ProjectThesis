import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import Challenge from "../models/challenge.model";
import User from "../models/user.model";
import { ObjectId } from "mongodb";
import Logger from "../utils/logger";
import Quizz from "../models/quizz.model";

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
    try {
      const user: any = req.user;

      let challenges = await Challenge.find({
        $or: [{ admins: user._id }, { participants: user._id }],
      }).exec();
    
      const sendObj = challenges.map((challenge) => {
        return {
          ...challenge.toObject(),
          user_type: challenge.admins.includes(user._id) ? "Admin" : "User",
        };
      });

      return res.status(200).json({
        status: true,
        challenges: sendObj,
      });
      
    } catch (error) {
      throw new Error("Error fetching challenges: " + error);
    }
  }

  static async GetSingleChallenge(req: Request, res: Response, next: NextFunction) {
    try {
      let response = { status: false, message: "" };

      const user: any = req.user;
      const id = req.params.id;

      let challenge = await Challenge.findOne({ _id: id }).populate({
        path: "participants",
        select: "fullname email avatar studentId challengeScores",
        populate: {
          path: "challengeScores",
          match: { challenge: id },
          select: "score",
        },
      });

      if (!challenge) {
        Logger.error("Challenge not found");
        response = { status: false, message: "Challenge not found" };
        return res.status(200).json(response);
      }

      const isUserInChallenge = challenge.participants.some((participant) => participant._id.toString() === user._id) || challenge.admins.includes(user._id);
      if (!isUserInChallenge) {
        Logger.error("You don't have access to this challenge.");
        response = { status: false, message: "You don't have access to this challenge." };
        return res.status(200).json(response);
      }
      
      return res.status(200).json({
        status: true,
        challenge: challenge,
      });
    } catch (error) {
      throw new Error("Error fetching challenges: " + error);
    }
  }

  static async JoinChallenge(req: Request, res: Response, next: NextFunction) {
    try {
      let response = { status: false, message: "" };
      const userId: any = req.user._id;
      const token: string = req.body.token;

      const user = await User.findById(userId);
      const challenge = await Challenge.findById(token);

      if (!user || !challenge) {
        Logger.error("User or challenge not found");
        response = { status: false, message: "User or challenge not found" };
        return res.status(200).json(response);
      }

      if (challenge.participants.includes(user._id)) {
        Logger.error("User is already on the challenge.");
        response = { status: false, message: "User is already on the challenge." };
        return res.status(200).json(response);
      }

      if (challenge.admins.includes(user._id)) {
        Logger.error("You are an admin of this challenge.");
        response = { status: false, message: "You are an admin of this challenge." };
        return res.status(200).json(response);
      }

      // Updates the user model with score = 0
      user.challengeScores.push({ challenge: challenge._id, score: 0 });
      const userUpdated = await user.save();

      // Updates the challenge model with the new participant
      challenge.participants.push(userId);
      const challengeUpdated = await challenge.save();

      return res.status(200).json({ status: true, challenge: challengeUpdated });
    } catch (error) {
      throw new Error("Error adding user to challenge: " + error);
    }
  }

  static async GetAllChallengeQuizzes(req: Request, res: Response, next: NextFunction) {
    let response = { status: false, message: "" };
    const challengeId  = req.params.id;
    const userId: any = req.user._id;
    
    try {
      const challenge = await Challenge.findById(challengeId);
      
      if (!challenge) {
        Logger.error("Challenge not found");
        response = { status: false, message: "Challenge not found" };
        return res.status(200).json(response);
      }

      if (!challenge.admins.includes(userId)) {
        Logger.error("No permissions");
        response = { status: false, message: "No permissions" };
        return res.status(200).json(response);
      }

      const quizzIds = challenge.quizzes;
      const quizzes = await Quizz.find({ _id: { $in: quizzIds } });
      
      return res.status(200).json({ status: true, quizzes });
    } catch (error) {
      throw new Error("Error fecthing all quizzes from challenge: " + error);
    }
  }
}

export default ChallengeController;
