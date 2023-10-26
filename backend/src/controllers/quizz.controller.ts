import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import Quizz from "../models/quizz.model";
import { ObjectId } from "mongodb";
import Challenge from "../models/challenge.model";

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
        id: quiz._id
      });
    } catch (error) {
      next(error);
    }
  }

  static async EditQuizz(req: Request, res: Response, next: NextFunction) {
    try {
      const { quizzId, questions } = req.body;

      const quiz = await Quizz.findByIdAndUpdate(quizzId, { questions }, { new: true });

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

  static async DeleteQuizz(req: Request, res: Response, next: NextFunction) {
    try {
      const quizId = req.body.quizId;

      // Find the corresponding challenge and remove the quiz's _id
      const challenge = await Challenge.findOneAndUpdate({ quizzes: quizId }, { $pull: { quizzes: quizId } }, { new: true });

      if (!challenge) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: false,
          message: "Challenge not found for the given quiz",
        });
      }

      const quiz = await Quizz.findByIdAndDelete(quizId);

      if (!quiz) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: false,
          message: "Quizz not found",
        });
      }

      return res.status(StatusCodes.OK).json({
        status: true,
        message: "Quizz deleted successfully",
        challenge,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default QuizzController;
