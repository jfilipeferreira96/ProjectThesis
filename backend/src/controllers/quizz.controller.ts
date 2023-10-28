import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import Quizz from "../models/quizz.model";
import { ObjectId } from "mongodb";
import Challenge from "../models/challenge.model";
import Logger from "../utils/logger";

class QuizzController {
  static async GetSingleQuizz(req: Request, res: Response, next: NextFunction) {
    try {
      const quizId = req.params.id;
      const quiz = await Quizz.findById(quizId);

      if (!quiz) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: false,
          message: "Quizz not found",
        });
      }

      return res.status(StatusCodes.OK).json({
        status: true,
        quiz,
      });
    } catch (error) {
      next(error);
    }
  }

  static async AddQuizz(req: Request, res: Response, next: NextFunction) {
    try {
      const { questions, challengeId, name, startdate, enddate } = req.body;
      const user = req.user;

      const quiz = await Quizz.create({
        user,
        name,
        startDate: startdate,
        endDate: enddate,
        questions,
        challenge: challengeId,
      });

      const challenge = await Challenge.findByIdAndUpdate(challengeId, { $push: { quizzes: quiz._id } }, { new: true });

      return res.status(StatusCodes.OK).json({
        status: true,
        id: quiz._id,
      });
    } catch (error) {
      next(error);
    }
  }

  static async EditQuizz(req: Request, res: Response, next: NextFunction) {
    try {
      const { quizzId, questions, challengeId, name, startdate, enddate } = req.body;
      const user: any = req.user;

      const quiz = await Quizz.findById(quizzId);

      if (!quiz) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: false,
          message: "Quizz not found",
        });
      }

      const challenge = await Challenge.findOne({ quizzes: quiz._id });

      if (!challenge) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: false,
          message: "Challenge not found",
        });
      }

      const isAdmin = challenge.admins.includes(user._id);

      if (isAdmin) {
        const updatedQuiz = await Quizz.findByIdAndUpdate(
          quizzId,
          {
            name,
            startDate: startdate,
            endDate: enddate,
            questions,
          },
          { new: true }
        );

        return res.status(StatusCodes.OK).json({
          status: true,
          quiz: updatedQuiz,
        });
      } else {
        return res.status(StatusCodes.FORBIDDEN).json({
          status: false,
          message: "Permission denied. User is not an admin of the challenge.",
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async EditQuizStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const quizId = req.body.quizId;
      const newStatus = req.body.status;
      const user: any = req.user;

      const quiz = await Quizz.findById(quizId);

      if (!quiz) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: false,
          message: "Quiz not found",
        });
      }

      const challenge = await Challenge.findOne({ quizzes: quiz._id });

      if (!challenge) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: false,
          message: "Challenge not found",
        });
      }

      const isAdmin = challenge.admins.includes(user._id);

      if (isAdmin) {
        quiz.status = newStatus;
        const updatedQuiz = await quiz.save(); 

        return res.status(StatusCodes.OK).json({
          status: true,
          message: "Quiz updated successfully",
          updatedQuiz,
        });
      } else {
        return res.status(StatusCodes.FORBIDDEN).json({
          status: false,
          message: "Permission denied. User is not an admin of the challenge.",
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async DeleteQuizz(req: Request, res: Response, next: NextFunction) {
    try {
      const quizId = req.body.quizId;
      const user: any = req.user;

      const quiz = await Quizz.findByIdAndDelete(quizId);
      if (!quiz) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: false,
          message: "Quizz not found",
        });
      }

      const challenge = await Challenge.findOne({ quizzes: quiz._id });
      if (!challenge) {
        Logger.error("Challenge not found");

        return res.status(StatusCodes.NOT_FOUND).json({
          status: false,
          message: "Challenge not found",
        });
      }

      const isAdmin = challenge.admins.includes(user._id);
      if (isAdmin) {
        const deletedQuiz = await Quizz.findByIdAndDelete(quizId);

        return res.status(StatusCodes.OK).json({
          status: true,
          message: "Quizz deleted successfully",
          deletedQuiz,
        });
      } else {
        Logger.error("Permission denied. User is not an admin of the challenge.");
        return res.status(StatusCodes.FORBIDDEN).json({
          status: false,
          message: "Permission denied. User is not an admin of the challenge.",
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

export default QuizzController;
