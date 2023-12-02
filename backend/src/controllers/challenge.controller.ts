import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import Challenge from "../models/challenge.model";
import User from "../models/user.model";
import { ObjectId } from "mongodb";
import Logger from "../utils/logger";
import Quizz, { Status } from "../models/quizz.model";
import QuizResponse from "../models/quizzResponse.model";

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

  static async EditChallenge(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { title, description, type } = req.body;
      const user: any = req.user;

      const challenge = await Challenge.findById(id);

      if (!challenge) {
        return res.status(404).json({ status: false, message: "Challenge not found" });
      }

      // Verificar se o user é um administrador do desafio
      if (!challenge.admins.includes(user._id)) {
        return res.status(403).json({ status: false, message: "You are not authorized to edit this challenge" });
      }

      // Atualizar os detalhes do desafio
      challenge.title = title || challenge.title;
      challenge.description = description || challenge.description;
      challenge.type = type || challenge.type;

      const updatedChallenge = await challenge.save();

      return res.status(200).json({
        status: true,
        message: "Challenge updated successfully",
        challenge: updatedChallenge,
      });
    } catch (error) {
      next(error);
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

      const activeQuizz = await Quizz.findOne({
        challenge: id,
        status: Status.InProgress,
      });

      if (activeQuizz) {
        const quizResponseCount = await QuizResponse.countDocuments({
          quiz: activeQuizz._id,
          user: user._id,
        });

        const responseChallenge = {
          ...challenge.toObject(),
          activeQuizz: {
            id: activeQuizz._id,
            completed: quizResponseCount > 0,
          },
        };

        return res.status(200).json({
          status: true,
          challenge: responseChallenge,
        });
      } else {
        return res.status(200).json({
          status: true,
          challenge: challenge,
        });
      }
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
    const challengeId = req.params.id;
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

      return res.status(200).json({ status: true, quizzes, type: challenge.type });
    } catch (error) {
      throw new Error("Error fecthing all quizzes from challenge: " + error);
    }
  }

  static async addAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { challengeId, userId } = req.body;

      // Verificar se o user existe
      const userExists = await User.exists({ _id: userId });
      if (!userExists) {
        return res.status(404).json({ status: false, message: "User not found" });
      }

      // Verificar se o user já é um admin
      const challenge = await Challenge.findById(challengeId);
      if (challenge) {
        if (challenge.admins.includes(userId)) {
          return res.status(400).json({ status: false, message: "User is already an admin of this challenge" });
        }

        // Verificar se o user já está no desafio como participante
        if (challenge.participants.includes(userId)) {
          return res.status(400).json({ status: false, message: "User is already a participant in this challenge" });
        }

        // Adicionar o user como admin do desafio
        challenge.admins.push(userId);
        await challenge.save();

        return res.status(200).json({ status: true, message: "User added as admin successfully" });
      }
    } catch (error) {
      next(error);
    }
  }

  static async removeAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { challengeId, userId } = req.body;

      // Verificar se o desafio existe
      const challenge = await Challenge.findById(challengeId);
      if (!challenge) {
        return res.status(404).json({ status: false, message: "Challenge not found" });
      }

      // Verificar se o user é um administrador do desafio
      if (!challenge.admins.includes(userId)) {
        return res.status(400).json({ status: false, message: "User is not an admin of this challenge" });
      }

      // Remover o user como administrador do desafio
      const index = challenge.admins.indexOf(userId);
      challenge.admins.splice(index, 1);
      await challenge.save();

      return res.status(200).json({ status: true, message: "Admin removed from the challenge successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export default ChallengeController;
