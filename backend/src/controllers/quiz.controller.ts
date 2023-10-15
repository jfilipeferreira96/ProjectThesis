import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import Quizz from "../models/quizz.model";
import { ObjectId } from "mongodb";

class QuizzController {
  static async fetchQuizz(req: Request, res: Response, next: NextFunction) {
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

  static async addQuizz(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, createdAt, endDate, startDate, name, questions } = req.body;

      const quiz = await Quizz.create({
        user,
        createdAt,
        endDate,
        startDate,
        name,
        questions,
      });

      return res.status(StatusCodes.OK).json({
        status: true,
        id: quiz._id,
      });
    } catch (error) {
      next(error);
    }
  }

  static async editQuizz(req: Request, res: Response, next: NextFunction) {
    try {
      const quizId = req.params.id;
      const updateData = req.body;

      const quiz = await Quizz.findByIdAndUpdate(quizId, updateData, { new: true });

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

  static async deleteQuizz(req: Request, res: Response, next: NextFunction) {
    try {
      const quizId = req.params.id;
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
      });
    } catch (error) {
      next(error);
    }
  }
}

export default QuizzController;
