import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import Quizz, { Status } from "../models/quizz.model";
import { ObjectId } from "mongodb";
import Challenge from "../models/challenge.model";
import Logger from "../utils/logger";
import QuizResponse, { IQuizResponse } from "../models/quizzResponse.model"
import User from "../models/user.model";

class QuizzController {
  static async GetSingleQuizz(req: Request, res: Response, next: NextFunction) {
    try {
      const quizId = req.params.id;
      const quiz = await Quizz.findById(quizId);
      const user:any = req.user;

      if (!quiz) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: false,
          message: "Quizz not found",
        });
      }

      const challenge = await Challenge.findById(quiz.challenge);
      if (!challenge){
        return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Challenge not found" });
      }

      const userIsAdmin =  challenge.admins.some(admin => admin._id.toString() === user._id);

      if (userIsAdmin)
      {
        //Sends the quiz to edit
        return res.status(StatusCodes.OK).json({
          status: true,
          quiz,
        });
      } else {
      
        if (quiz.status === Status.Completed)
        {
          return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Quiz is completed" });
        }

        if (quiz.status === Status.PendingStart)
        {
          return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Quiz is yet to be started" });
        }

        //VERIFICAR SE O ALUNO JA RESPONDEU AO QUIZ
        /* if (quiz.status === Status.PendingStart)
        {
          return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "You have already awnsered this quiz." });
        } */

        // Sends the user the quiz without the correct awnsers in the form
        const questionsWithoutCorrectAnswer = quiz.questions.map(question => {
          return {
            _id: question._id,
            question: question.question,
            type: question.type,
            choices: question.choices,
          };
        });
        
        return res.status(StatusCodes.OK).json({
          status: true,
          questions: questionsWithoutCorrectAnswer,
        });
      } 

    } catch (error) {
      next(error);
    }
  }

  static async AddQuizz(req: Request, res: Response, next: NextFunction) {
    try {
      const { questions, challengeId, name, startdate, enddate } = req.body;
      const user = req.user;
      console.log(req.body)
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

      const isAdmin = challenge.admins.some(admin => admin._id.toString() === user._id);

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

      const isAdmin = challenge.admins.some(admin => admin._id.toString() === user._id);

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

      const isAdmin = challenge.admins.some(admin => admin._id.toString() === user._id);
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

  static async SaveQuizAnswer(req: Request, res: Response, next: NextFunction){
    try{
      const { quizId, userAnswers } = req.body;
      const user: any = req.user;

      // Check if the quiz exists
      const quiz = await Quizz.findById(quizId);
      if (!quiz)
      {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: false,
          message: "Quiz not found",
        });
      }

      // Check if the user is not an admin
      const challenge = await Challenge.findOne({ quizzes: quiz._id });
      if (!challenge){
        return res.status(StatusCodes.NOT_FOUND).json({
          status: false,
          message: "Challenge not found",
        });
      }

      const isAdmin = challenge.admins.some(admin => admin._id.toString() === user._id);
      if (isAdmin){
        return res.status(StatusCodes.FORBIDDEN).json({
          status: false,
          message: "Permission denied. Admins cannot answer quizzes.",
        });
      }

      // Check if the quiz status is InProgress
      if (quiz.status !== Status.InProgress){
        return res.status(StatusCodes.NOT_FOUND).json({
          status: false,
          message: "Quiz is not in progress",
        });
      }

      let score = 0;
      let correctAnswers = 0;
      let wrongAnswers = 0;
      
      userAnswers.forEach((userAnswer: { _id: number | string; answer: string}) => {
        const question = quiz.questions.find((q) => q._id && q._id.toString() === userAnswer._id);
        const answer = userAnswer.answer;

        if (question){
          if (question.type === "FillInBlank"){
            if (answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase())
            {
              score += 5;
              correctAnswers += 1;
            } else
            {
              wrongAnswers += 1;
            }
          } else {
            if (answer === question.correctAnswer)
            {
              score += 5;
              correctAnswers += 1;
            } else
            {
              wrongAnswers += 1;
            }
          }
        }
      });

      // Create and save quiz response
      const quizResponseData = {
        quiz: quizId,
        user: user._id,
        answers: userAnswers,
        score,
      };

      const quizResponse = await QuizResponse.create(quizResponseData);
      const UserModel = await User.findById(user._id);
      
      if (UserModel) {
        const existingChallengeScore = UserModel.challengeScores.find((c) => c.challenge.toString() === challenge._id.toString());
        if (existingChallengeScore) {
          existingChallengeScore.score += score; // Update the score
        } else {
          // If the user doesn't have a score for this challenge, add it
          UserModel.challengeScores.push({
            challenge: challenge._id,
            score: score,
          });
        }
        
        await UserModel.save();
      } 

      return res.status(StatusCodes.OK).json({
        status: true,
        message: "Quiz response saved successfully",
        data: {
          score: score,
          correctAnswers: correctAnswers,
          wrongAnswers: wrongAnswers,
          userAnswers: userAnswers,
        },
      });

    } catch (error)
    {
      next(error);
    }
  }
}

export default QuizzController;
