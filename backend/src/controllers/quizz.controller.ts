import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import Quizz from "../models/quizz.model";
import { ObjectId } from "mongodb";

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
      console.log(req.body);     
      console.log(req.user)
      const { questions } = req.body;
      const user = req.user;

      const quiz = await Quizz.create({
        user,
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

  static async EditQuizz(req: Request, res: Response, next: NextFunction) {
    try {
      const { quizzId, questions } = req.body;
      console.log(quizzId, questions);
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
      const quizId = req.body;
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
